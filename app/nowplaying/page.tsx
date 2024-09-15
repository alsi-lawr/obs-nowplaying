import React from "react";
import NowPlaying from "@/components/NowPlaying";
import { spotifyTrackService } from "@/services/SpotifyClient/SpotifyTrackServiceController";
import { queryRefreshToken } from "@/services/SpotifyAuthHook";
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
  if (!spotifyTrackService.getIsRunning()) {
    spotifyTrackService.startServiceFromAuthCode({ code: searchParams.code });
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
  redirect("/nowplaying");
}
