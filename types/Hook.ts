export enum SpotifyDataType {
  Artwork = "Artwork",
  Artist = "Artist",
  Track = "Track",
}

export type SpotifyData = {
  id: string;
  data: string | null;
};

export type SpotifyDataMap = Record<SpotifyDataType, SpotifyData | null>;
