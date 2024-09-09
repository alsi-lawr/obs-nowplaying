import { NextResponse } from "next/server";
import { spotifyTrackService } from "@/app/services/SpotifyClient/SpotifyTrackServiceController";
import { APIResult, OK, Error, Success } from "@/types/API";

const missingAuthCode: APIResult<string> = {
  result: "Missing parameter AuthCode",
  status: 400,
};

export async function POST(req: Request) {
  try {
    const authCode: string = await req.json();
    if (!authCode) return NextResponse.json(missingAuthCode);
    spotifyTrackService.startServiceFromAuthCode({ code: authCode });
    return NextResponse.json(OK);
  } catch (error: unknown) {
    return NextResponse.json(Error(error));
  }
}

export async function GET() {
  return NextResponse.json(Success(spotifyTrackService.getIsRunning()));
}
