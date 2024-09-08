import React from "react";
import NowPlaying from "@/app/components/nowplaying/NowPlaying";
import { spotifyTrackService } from "@/app/services/SpotifyClient/SpotifyTrackServiceController";
import SpotifyAuth from "@/app/components/spotifyauth/SpotifyAuth";
import config from "../../../appconfig.json";
import { getAuthUrl, queryRefreshToken } from "@/app/services/SpotifyAuthHook";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    code?: string | null;
    error?: string | null;
  };
}

export default async function Page({ searchParams }: PageProps) {
  if (!searchParams.code) {
    const token = await queryRefreshToken();
    if (token) {
      spotifyTrackService.startServiceFromRefreshToken({ token: token });
      return <NowPlaying />;
    }
    const url = getAuthUrl(config.authorization);
    redirect(url);
  }

  spotifyTrackService.startServiceFromAuthCode({ code: searchParams.code });

  return <NowPlaying />;
}
