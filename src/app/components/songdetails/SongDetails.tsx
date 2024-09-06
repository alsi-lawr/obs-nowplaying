"use client";

import Artist from "../artist/Artist";
import Title from "../title/Title";
import "./SongDetails.css";

type SongDetailsProperties = {
  artist: string;
  title: string;
};

export default function SongDetails({ artist, title }: SongDetailsProperties) {
  return (
    <div className="song-details">
      <Artist src={artist} />
      <Title src={title} />
    </div>
  );
}
