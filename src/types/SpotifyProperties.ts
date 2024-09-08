export type AuthorizationProperties = {
  authorizationAddress: string;
  scopes: string;
  responseType: string;
  callbackAddress: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
};

export type TrackAgentProperties = {
  currentlyPlayingAddress: string;
  spotifyTrackRefreshIntervalMs: number;
  rateLimit: boolean;
  artworkSize: string | null;
};

export type RefreshProperties = {
  authTokenRefreshAddress: string;
  authTokenRefreshIntervalMs: number;
};

export type SpotifyProperties = {
  authorization: AuthorizationProperties;
  trackAgent: TrackAgentProperties;
  refresh: RefreshProperties;
};
