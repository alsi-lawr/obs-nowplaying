import { useEffect, useState } from "react";
import "./Artist.css";
import { SpotifyDataType } from "@/types/Hook";
import { SongDetailsProperties } from "../songdetails/SongDetails";
import { useFetchData } from "../hookintoupdates/FetchDataHook";

export default function Artist({ setHasData }: SongDetailsProperties) {
  const [transitionClass, setTransitionClass] = useState("");
  const { data } = useFetchData();
  const [artistContents, setArtistContents] = useState<string | null>(null);

  useEffect(() => {
    setTransitionClass("fade-out");
    const artistData = data?.[SpotifyDataType.Artist];
    setHasData(false);
    setTimeout(() => {
      setArtistContents(null);
      if (setHasData && artistData?.id) setHasData(true);
      setTimeout(() => {
        setTransitionClass("fade-in");
        if (artistData?.id) {
          setArtistContents(artistData?.data ?? null);
        }
      }, 1000);
    }, 1000);
  }, [data, setHasData]);
  return <div className={`artist ${transitionClass}`}>{artistContents}</div>;
}
