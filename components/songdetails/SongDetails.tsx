import React, { useState, useEffect } from "react";
import Artist from "../artist/Artist";
import Title from "../title/Title";
import "./SongDetails.css";

export type SongDetailsProperties = {
  setHasData: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SongDetails() {
  const [hasArtistData, setHasArtistData] = useState(false);
  const [hasTitleData, setHasTitleData] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Scroll out and back in for changes
  useEffect(() => {
    setHasData(hasArtistData && hasTitleData);
    // setHasData(false);
    // if(!hasArtistData || !hasTitleData){
    //   return;
    // }
    // setTimeout(() => {
    // }, 1000);
  }, [hasArtistData, hasTitleData, setHasData]);

  return (
    <div className={`song-details${hasData ? "" : " no-data"}`}>
      <Artist setHasData={setHasArtistData} />
      <Title setHasData={setHasTitleData} />
    </div>
  );
}
