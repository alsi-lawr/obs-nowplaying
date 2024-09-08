import { RefreshProperties } from "@/types/SpotifyProperties";
import { storeToken } from "../SpotifyAuthHook";
import axios from "axios";

export class RefreshTokenService {
  private refreshConfig: RefreshProperties;
  private refreshToken: string | null = null;
  private callbackAddress: string;
  private spotifyAuthKey: string;

  constructor(
    refreshConfig: RefreshProperties,
    callbackAddress: string,
    spotifyAuthKey: string,
  ) {
    this.refreshConfig = refreshConfig;
    this.callbackAddress = callbackAddress;
    this.spotifyAuthKey = spotifyAuthKey;
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  async getNewRefreshToken(authCode: string): Promise<RefreshTokenResult> {
    const refreshUrl = this.refreshConfig.authTokenRefreshAddress;
    const response = await axios.post(
      refreshUrl,
      this.getURLParams(authCode),
      this.getRequestHeaders(),
    );
    const result = await response.data;
    if (result.access_token && result.expires_in && result.refresh_token) {
      this.refreshToken = result.refresh_token;
      await storeToken(result.refresh_token);
      return {
        access_token: result.access_token,
        expires_in: result.expires_in,
      };
    }

    throw new Error("Failed to get access token");
  }

  async getNewAccessToken(): Promise<RefreshTokenResult> {
    const refreshUrl = this.refreshConfig.authTokenRefreshAddress;
    const response = await axios.post(
      refreshUrl,
      this.getURLParams(),
      this.getRequestHeaders(),
    );
    const result = await response.data;
    if (result.access_token && result.expires_in) {
      return {
        access_token: result.access_token,
        expires_in: result.expires_in,
      };
    }

    throw new Error("Failed to refresh access token");
  }

  private getURLParams(authCode?: string | null): URLSearchParams {
    if (!authCode && this.refreshToken) {
      return new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      });
    }

    if (!authCode) {
      throw new Error("No auth code provided");
    }

    return new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: this.callbackAddress,
    });
  }

  private getRequestHeaders(): any {
    return {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(this.spotifyAuthKey).toString("base64")}`,
        "User-Agent": "NowPlaying/1.0.0",
      },
    };
  }
}

type RefreshTokenResult = {
  access_token: string;
  expires_in: number;
};
