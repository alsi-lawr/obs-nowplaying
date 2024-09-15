import { spotifyTrackService } from "@/services/SpotifyClient/SpotifyTrackServiceController";
import { SpotifyDataMap, SpotifyDataType } from "@/types/Hook";

export async function GET(req: Request) {
  let lastResponse: SpotifyDataMap = {
    [SpotifyDataType.Track]: null,
    [SpotifyDataType.Artist]: null,
    [SpotifyDataType.Artwork]: null,
  };
  let continuePolling: boolean = true;
  if (!spotifyTrackService.getIsRunning()) {
    return new Response("Not running", { status: 500 });
  }
  const responseStream = new ReadableStream({
    async start(controller) {
      const sendDataToClient = (data: SpotifyDataMap | null) => {
        controller.enqueue(`data: ${JSON.stringify(data ?? "")}\n\n`);
      };

      const pollForUpdates = async () => {
        while (continuePolling) {
          try {
            const latestData = await updateLastResponse(lastResponse);
            const hasValidData = Object.values(latestData).some(
              (item) => item?.id && item?.data,
            );
            const isNotPlaying = Object.entries(latestData).every(
              (key) =>
                !key[1]?.id && lastResponse[key[0] as SpotifyDataType]?.id,
            );

            if (hasValidData) {
              sendDataToClient(latestData);
            }

            if (isNotPlaying) {
              sendDataToClient(null);
            }

            lastResponse = latestData;
          } catch (error) {
            console.error(error);
            controller.error(error);
            break;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, spotifyTrackService.getTimeoutMs() ?? 1000),
          );
        }
      };

      pollForUpdates();
      const abortSignal = () => {
        console.log("Aborted");
        controller.close();
        continuePolling = false;
      };
      req.signal.addEventListener("abort", abortSignal);
      // cleanup on application shutdown
      process.on("SIGINT", abortSignal);
      process.on("SIGTERM", abortSignal);
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

async function updateLastResponse(
  lastResponse: SpotifyDataMap,
): Promise<SpotifyDataMap> {
  await spotifyTrackService.getLatest(
    SpotifyDataType.Track,
    lastResponse[SpotifyDataType.Track]?.id ?? null,
  );
  return {
    [SpotifyDataType.Track]: await spotifyTrackService.getLatest(
      SpotifyDataType.Track,
      lastResponse[SpotifyDataType.Track]?.id ?? null,
    ),
    [SpotifyDataType.Artist]: await spotifyTrackService.getLatest(
      SpotifyDataType.Artist,
      lastResponse[SpotifyDataType.Artist]?.id ?? null,
    ),
    [SpotifyDataType.Artwork]: await spotifyTrackService.getLatest(
      SpotifyDataType.Artwork,
      lastResponse[SpotifyDataType.Artwork]?.id ?? null,
    ),
  };
}
