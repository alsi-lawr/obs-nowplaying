import React, { useState, useEffect } from "react";
import Artist from "../artist/Artist";
import Title from "../title/Title";
import "./SongDetails.css";

type SongDetailsProperties = {
  setHasData: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SongDetails({ setHasData }: SongDetailsProperties) {
  const [artistName, setArtistName] = useState<string | null>(null);
  const [songTitle, setSongTitle] = useState<string | null>(null);

  // Scroll out and back in for changes
  useEffect(() => {
    setHasData(false);
    setTimeout(() => {
      if (
        artistName &&
        songTitle &&
        artistName.length > 0 &&
        songTitle.length > 0
      ) {
        setHasData(true);
      }
    }, 1000);
  }, [artistName, songTitle]);

  return (
    <div className="song-details">
      <Artist onStateChange={setArtistName} />
      <Title onStateChange={setSongTitle} />
    </div>
  );
}
