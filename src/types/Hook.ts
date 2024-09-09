export enum SpotifyDataType {
  Artwork = "Artwork",
  Artist = "Artist",
  Track = "Track",
}

export type SpotifyData = {
  id: string;
  data: string | null;
};
