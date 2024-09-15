import { APIResult } from "@/types/API";
import axios from "axios";

export async function startSpotifyService(
  authCode: string,
): Promise<APIResult<string>> {
  const url = `/api/spotify`;
  try {
    const response = await axios.post(url, JSON.stringify(authCode), {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return { result: null, status: 500 };
  }
}

export async function stopSpotifyService(): Promise<APIResult<string>> {
  const url = "/api/spotify/stop";
  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    return { result: null, status: response.status };
  }
  return response.json();
}
