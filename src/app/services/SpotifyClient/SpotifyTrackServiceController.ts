import { SpotifyProperties } from "@/types/SpotifyProperties";
import { SpotifyTrackListener } from "./SpotifyTrackListener";
import { SpotifyData, SpotifyDataType } from "@/types/Hook";
import { AuthCode } from "@/types/Auth";
import { RefreshToken } from "@prisma/client";

class SpotifyTrackServiceController {
  private isRunning: boolean = false;
  private spotifyTrackListener: SpotifyTrackListener | null = null;
  private config: SpotifyProperties;

  constructor(config: SpotifyProperties) {
    this.config = config;
  }

  startServiceFromAuthCode(authCode: AuthCode) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.spotifyTrackListener = SpotifyTrackListener.createWithAuthCode(
      authCode,
      this.config.refresh,
      this.config.trackAgent,
      this.config.authorization.callbackAddress,
      `${this.config.authorization.spotifyClientId}:${this.config.authorization.spotifyClientSecret}`,
    );
    console.log("SpotifyTrackService is running");
  }

  startServiceFromRefreshToken(refreshToken: RefreshToken) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.spotifyTrackListener = SpotifyTrackListener.createWithRefreshToken(
      refreshToken,
      this.config.refresh,
      this.config.trackAgent,
      this.config.authorization.callbackAddress,
      `${this.config.authorization.spotifyClientId}:${this.config.authorization.spotifyClientSecret}`,
    );
    console.log("SpotifyTrackService is running");
  }

  async getLatest(
    dataType: SpotifyDataType,
    id: string | null,
  ): Promise<SpotifyData | null> {
    if (!this.isRunning || !this.spotifyTrackListener) {
      console.log("Not running or no listener found");
      return null;
    }
    return await this.spotifyTrackListener.getLatest(dataType, id);
  }

  stopService() {
    this.isRunning = false;
    if (this.spotifyTrackListener) {
      this.spotifyTrackListener.dispose();
    }
    this.spotifyTrackListener = null;
    console.log("SpotifyTrackService is stopped");
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getAuthUrl(): string {
    return `${this.config.authorization.authorizationAddress}?client_id=${this.config.authorization.spotifyClientId}&response_type=${this.config.authorization.responseType}&redirect_uri=${this.config.authorization.callbackAddress}&scope=${this.config.authorization.scopes}`;
  }

  getTimeoutMs(): number {
    return this.config.trackAgent.spotifyTrackRefreshIntervalMs;
  }
}

import fs from "fs";
import path from "path";

class SingletonWrapper {
  private static instance: SpotifyTrackServiceController;

  public static getInstance(): SpotifyTrackServiceController {
    if (!SingletonWrapper.instance) {
      const config = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "appconfig.json"), "utf8"),
      ) as SpotifyProperties;
      SingletonWrapper.instance = new SpotifyTrackServiceController(config);
    }

    return SingletonWrapper.instance;
  }
}

export const spotifyTrackService = SingletonWrapper.getInstance();
