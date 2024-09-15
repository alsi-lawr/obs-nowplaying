"use client";

import React from "react";
import AlbumArtwork from "./artwork/AlbumArtwork";
import SongDetails from "./songdetails/SongDetails";
import "./NowPlaying.css";
import { FetchDataProvider } from "./hookintoupdates/FetchDataProvider";

export default function NowPlaying() {
  return (
    <div className={`container`}>
      <FetchDataProvider>
        <AlbumArtwork />
        <SongDetails />
      </FetchDataProvider>
    </div>
  );
}
