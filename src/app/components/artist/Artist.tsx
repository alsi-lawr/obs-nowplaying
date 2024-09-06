"use client";

import { useState } from "react";
import "./Artist.css";
import useFetchFileData from "../FetchFileData";

export default function Artist({ src: src }: FileLoadProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data: artistContents } = useFetchFileData(
    src,
    (fetchedData, setData) => {
      setTransitionClass("fade-out");
      setTimeout(() => {
        setData(atob(fetchedData ?? ""));
        setTransitionClass("fade-in");
      }, 2000);
    },
  );
  return <div className={`artist ${transitionClass}`}>{artistContents}</div>;
}
