import { useState } from "react";
import "./Artist.css";
import useFetchFileData from "../hookintoupdates/FetchData";
import { FetchDataProperties } from "../hookintoupdates/FetchDataProperties";
import { SpotifyDataType } from "@/types/Hook";

export default function Artist({ onStateChange }: FetchDataProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: artistContents } = useFetchFileData(
    SpotifyDataType.Artist,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      const artist = fetchedData ?? "";
      if (onStateChange) onStateChange(artist);
      setTimeout(() => {
        setTransitionClass("fade-in");
        setData(artist);
      }, 1000);
    },
  );
  return <div className={`artist ${transitionClass}`}>{artistContents}</div>;
}
