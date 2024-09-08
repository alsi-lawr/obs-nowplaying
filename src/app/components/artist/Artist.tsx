"use client";

import { useState } from "react";
import "./Artist.css";
import useFetchFileData from "../fetchfile/FetchFileData";

export default function Artist({
  src: src,
  onStateChange,
}: FileLoadProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: artistContents } = useFetchFileData(
    src,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      const artist = atob(fetchedData ?? "");
      if (onStateChange) onStateChange(artist);
      setTimeout(() => {
        setTransitionClass("fade-in");
        setData(artist);
      }, 1000);
    },
  );
  return <div className={`artist ${transitionClass}`}>{artistContents}</div>;
}
