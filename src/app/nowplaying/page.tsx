import React from "react";
import NowPlaying from "@/app/components/nowplaying/NowPlaying";
import { spotifyTrackService } from "@/app/services/SpotifyClient/SpotifyTrackServiceController";
import { queryRefreshToken } from "@/app/services/SpotifyAuthHook";
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
    const url = spotifyTrackService.getAuthUrl();
    redirect(url);
  }

  spotifyTrackService.startServiceFromAuthCode({ code: searchParams.code });

  return <NowPlaying />;
}
