import { SpotifyDataType } from "@/types/Hook";
import { useState, useEffect } from "react";

type UseFetchDataReturn = {
  data: string | null;
};

function useFetchData(
  type: SpotifyDataType,
  processData: (
    fetchedData: string | null,
    setData: React.Dispatch<React.SetStateAction<string | null>>,
  ) => void,
): UseFetchDataReturn {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fileWatchEventSource = new EventSource(
      `/api/spotify/hook?dataType=${type}`,
    );

    fileWatchEventSource.onmessage = (event) => {
      const base64data = event.data;
      processData(base64data, setData);
    };

    fileWatchEventSource.onerror = function (e) {
      const event = e.target as EventSource;
      if (event.readyState === EventSource.CLOSED) {
        console.log("Connection closed");
        setTimeout(() => {}, 5000);
        window.location.reload();
      } else if (event.readyState === EventSource.CONNECTING) {
        console.log("Attempting to reconnect...");
      } else {
        console.error("Error occurred:", event);
        setTimeout(() => {}, 5000);
        window.location.reload();
      }
    };
  }, [type, processData]);

  return {
    data,
  };
}

export default useFetchData;
