import { useEffect, useState } from "react";
import "./Title.css";
import { SpotifyDataType } from "@/types/Hook";
import { useFetchData } from "../hookintoupdates/FetchDataHook";
import { SongDetailsProperties } from "../songdetails/SongDetails";

export default function Title({ setHasData }: SongDetailsProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data } = useFetchData();
  const [titleContents, setTitleContents] = useState<string | null>(null);

  useEffect(() => {
    setTransitionClass("fade-out");
    const titleData = data?.[SpotifyDataType.Track];
    setHasData(false);
    setTimeout(() => {
      setTitleContents(null); // refresh every time we get new data
      if (setHasData && titleData?.id) setHasData(true);
      setTimeout(() => {
        setTransitionClass("fade-in");
        if (titleData?.id) {
          setTitleContents(titleData?.data ?? null);
        }
      }, 1000);
    }, 1000);
  }, [data, setHasData]);
  return (
    <div
      className={
        titleContents
          ? `title ${titleContents.length > 23 ? "scroll-text" : ""} ${transitionClass}`
          : "title"
      }
    >
      {titleContents}
    </div>
  );
}
