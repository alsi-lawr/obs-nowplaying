"use client";

import { useState } from "react";
import "./Title.css";
import useFetchFileData from "../fetchfile/FetchFileData";

export default function Title({ src, onStateChange }: FileLoadProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: titleContents } = useFetchFileData(
    src,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      const title = atob(fetchedData ?? "");
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
