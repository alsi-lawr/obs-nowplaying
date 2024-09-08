"use client";

import React, { useState, useEffect } from "react";
import AlbumArtwork from "./artwork/AlbumArtwork";
import SongDetails from "./songdetails/SongDetails";
import "./NowPlaying.css";

export default function NowPlaying() {
  const [hasData, setHasData] = useState(false);
  useEffect(() => {}, [hasData]);
  return (
    <div className={`container ${hasData ? "" : "no-data"}`}>
      <AlbumArtwork />
      <SongDetails setHasData={setHasData} />
    </div>
  );
}
