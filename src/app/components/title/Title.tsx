"use client";

import { useState } from "react";
import "./Title.css";
import useFetchFileData from "../FetchFileData";

export default function Title({ src: src }: FileLoadProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: titleContents } = useFetchFileData(
    src,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      setTimeout(() => {
        setData(atob(fetchedData ?? ""));
        setTransitionClass("fade-in");
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
