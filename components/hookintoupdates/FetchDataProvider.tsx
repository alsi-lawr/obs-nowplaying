import { SpotifyDataMap } from "@/types/Hook";
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  ReactElement,
} from "react";

interface FetchDataContextType {
  data: SpotifyDataMap | null;
}

interface FetchDataProviderProps {
  children: ReactNode;
}

export const FetchDataContext = createContext<FetchDataContextType | undefined>(
  undefined,
);

export const FetchDataProvider = ({
  children,
}: FetchDataProviderProps): ReactElement => {
  const [data, setData] = useState<SpotifyDataMap | null>(null);

  useEffect(() => {
    const watchEventSource = new EventSource(`/api/spotify/hook`);

    watchEventSource.onmessage = (event: MessageEvent) => {
      try {
        const eventData = JSON.parse(event.data) as SpotifyDataMap | null;
        setData(eventData);
      } catch (error) {
        console.error("Failed to parse event data:", error);
      }
    };

    watchEventSource.onerror = (e: Event) => {
      const eventSource = e.target as EventSource;
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("Connection closed");
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else if (eventSource.readyState === EventSource.CONNECTING) {
        console.log("Attempting to reconnect...");
      } else {
        console.error("Error occurred:", e);
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    };

    // Cleanup function to close the EventSource when the component unmounts
    return () => {
      watchEventSource.close();
    };
  }, []);

  return (
    <FetchDataContext.Provider value={{ data }}>
      {children}
    </FetchDataContext.Provider>
  );
};
