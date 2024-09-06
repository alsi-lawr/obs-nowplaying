import { NextResponse } from "next/server";
import chokidar from "chokidar";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (!file)
    return NextResponse.json(
      { error: "Missing file parameter" },
      { status: 400 },
    );

  const filePath = path.join(process.cwd(), file as string);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "File not found" }, { status: 404 });

  const responseStream = new ReadableStream({
    start(controller) {
      const sendFileAsBase64 = () => {
        const fileData = fs.readFileSync(filePath, { encoding: "base64" });
        controller.enqueue(`data: ${fileData}\n\n`);
      };
      sendFileAsBase64();

      const watcher = chokidar.watch(filePath, {
        usePolling: true,
        alwaysStat: true,
        interval: 100,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100,
        },
      });

      watcher.on("change", () => {
        sendFileAsBase64();
      });

      req.signal.addEventListener("abort", () => {
        watcher.close();
        controller.close();
      });
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
