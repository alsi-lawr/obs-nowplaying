import { NextResponse } from "next/server";
import { spotifyTrackService } from "@/services/SpotifyClient/SpotifyTrackServiceController";
import { OK } from "@/types/API";

export async function POST() {
  spotifyTrackService.stopService();
  return NextResponse.json(OK);
}
