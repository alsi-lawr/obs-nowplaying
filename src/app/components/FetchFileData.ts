import { useState, useEffect } from "react";

type UseFetchDataReturn = {
  data: string | null;
};

function useFetchFileData(
  src: string,
  processData: (
    fetchedData: string | null,
    setData: React.Dispatch<React.SetStateAction<string | null>>,
  ) => void,
): UseFetchDataReturn {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fileWatchEventSource = new EventSource(
      `/api/file-watch?file=${encodeURIComponent(src)}`,
    );

    fileWatchEventSource.onmessage = (event) => {
      const base64data = event.data;
      processData(base64data, setData);
    };
  }, [src]);

  return {
    data,
  };
}

export default useFetchFileData;
