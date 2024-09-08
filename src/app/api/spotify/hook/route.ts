import { spotifyTrackService } from "@/app/services/SpotifyClient/SpotifyTrackServiceController";
import { SpotifyData, SpotifyDataType } from "@/types/Hook";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dataTypeParam = searchParams.get("dataType");
  const dataType: SpotifyDataType =
    SpotifyDataType[dataTypeParam as keyof typeof SpotifyDataType];

  let lastResponse: SpotifyData | null = null;
  let continuePolling: boolean = true;
  if (!spotifyTrackService.getIsRunning()) {
    throw new Error("Not running");
  }
  const responseStream = new ReadableStream({
    async start(controller) {
      const sendDataToClient = (data: string | null) => {
        controller.enqueue(`data: ${data ?? ""}\n\n`);
      };

      const pollForUpdates = async () => {
        while (continuePolling) {
          try {
            const latestData = await spotifyTrackService.getLatest(
              dataType,
              lastResponse?.id ?? null,
            );
            if (latestData?.id && latestData?.data) {
              sendDataToClient(latestData.data);
            }

            if (!latestData?.id && lastResponse?.id) {
              sendDataToClient(null);
            }

            lastResponse = latestData;
          } catch (error) {
            console.error(error);
            controller.error(error);
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      };

      pollForUpdates();

      req.signal.addEventListener("abort", () => {
        controller.close();
        continuePolling = false;
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
