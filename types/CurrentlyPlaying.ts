export type CurrentlyPlaying = {
  is_playing: boolean;
  currently_playing_type: string;
  item: Track | null;
};

export type Track = {
  id: string;
  is_local: boolean;
  uri: string;
  artists: Artist[];
  name: string;
  album: Album;
};

export type Artist = {
  name: string;
};

export type Album = {
  id: string;
  name: string;
  images: Image[];
};

export type Image = {
  url: string;
};

export type TrackChanges = {
  track: string | null;
  album: string | null;
  artist: string | null;
};
