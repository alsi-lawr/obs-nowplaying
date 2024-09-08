import { useState } from "react";
import "./Title.css";
import useFetchFileData from "../hookintoupdates/FetchData";
import { FetchDataProperties } from "../hookintoupdates/FetchDataProperties";
import { SpotifyDataType } from "@/types/Hook";

export default function Title({ onStateChange }: FetchDataProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: titleContents } = useFetchFileData(
    SpotifyDataType.Track,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      const title = fetchedData ?? "";
      if (onStateChange) onStateChange(title);
      setTimeout(() => {
        setTransitionClass("fade-in");
        setData(title);
      }, 2000);
    },
  );
  return (
    <div
      className={
        titleContents
          ? `title ${titleContents.length > 23 ? "scroll-text" : ""} ${transitionClass}`
          : ""
      }
    >
      {titleContents}
    </div>
  );
}
