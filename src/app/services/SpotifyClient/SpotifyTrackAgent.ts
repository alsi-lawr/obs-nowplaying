import { TrackAgentProperties } from "@/types/SpotifyProperties";
import { CurrentlyPlaying, Track, Album } from "@/types/CurrentlyPlaying";
import { sqlClient } from "../SpotifyAuthHook";
import axios from "axios";
import { SpotifyData, SpotifyDataType } from "@/types/Hook";

export class SpotifyTrackAgent {
  private config: TrackAgentProperties;
  private current_track: TrackState | null = null;

  constructor(config: TrackAgentProperties) {
    this.config = config;
    this.resetCurrentPlaying().then(() => {
      return;
    });
  }

  async processUpdate(accessToken: string) {
    const currentlyPlaying = await this.getTrackInformation(accessToken);
    if (
      !currentlyPlaying.is_playing ||
      currentlyPlaying.currently_playing_type !== "track" ||
      !currentlyPlaying.item
    ) {
      await this.resetCurrentPlaying();
      this.current_track = { track_id: "", album_id: "", artist: "" };
      return;
    }

    this.current_track = await this.processTrackUpdate(currentlyPlaying.item);
  }

  async getTrackDiff(
    dataType: SpotifyDataType,
    id: string | null,
  ): Promise<SpotifyData | null> {
    if (!this.current_track) {
      console.log("No current track found");
      return null;
    }
    let data: SpotifyData | null = null;
    switch (dataType) {
      case SpotifyDataType.Artwork:
        data = {
          id: this.current_track.album_id,
          data:
            id === this.current_track.album_id
              ? null
              : await this.getAlbumArtwork(this.current_track.album_id),
        };
        return data;
      case SpotifyDataType.Artist:
        data = {
          id: this.current_track.track_id,
          data:
            id === this.current_track.track_id
              ? null
              : await this.getArtistName(this.current_track.track_id),
        };
        return data;
      case SpotifyDataType.Track:
        data = {
          id: this.current_track.track_id,
          data:
            id === this.current_track.track_id
              ? null
              : await this.getTrackName(this.current_track.track_id),
        };
        return data;
    }
  }

  private async resetCurrentPlaying() {
    await sqlClient.track
      .findMany({ where: { current: true } })
      .then((tracks) => {
        tracks.forEach(async (track) => {
          await sqlClient.track.update({
            where: { id: track.id },
            data: { current: false },
          });
        });
      });
  }

  private async processTrackUpdate(item: Track): Promise<TrackState> {
    const track = await sqlClient.track.findUnique({ where: { id: item.id } });
    if (!track) {
      console.log("Creating new track");
      this.resetCurrentPlaying();
      this.createTrack(item);
    } else if (!track.current) {
      console.log("Updating existing track");
      this.resetCurrentPlaying();
      await sqlClient.track.update({
        where: { id: track.id },
        data: { current: true },
      });
    }
    return {
      track_id: item.id,
      album_id: item.album.id,
      artist: item.artists.map((artist) => artist.name).join(", "),
    };
  }

  private async createTrack(item: Track) {
    await sqlClient.track.upsert({
      where: { id: item.id, uri: item.uri },
      create: {
        id: item.id,
        name: item.name,
        uri: item.uri,
        artist: item.artists.map((artist) => artist.name).join(", "),
        current: true,
        album: {
          connectOrCreate: {
            where: { id: item.album.id },
            create: {
              id: item.album.id,
              name: item.album.name,
              imageBase64: await this.getAlbumArtworkFromSpotify(item.album),
            },
          },
        },
      },
      update: {
        name: item.name,
        artist: item.artists.map((artist) => artist.name).join(", "),
        current: true,
        album: {
          connectOrCreate: {
            where: { id: item.album.id },
            create: {
              id: item.album.id,
              name: item.album.name,
              imageBase64: await this.getAlbumArtworkFromSpotify(item.album),
            },
          },
        },
      },
    });
  }

  private async getAlbumArtwork(album_id: string): Promise<string> {
    const album = await sqlClient.album.findUnique({
      where: { id: album_id },
    });
    return album?.imageBase64 ?? "";
  }

  private async getTrackName(track_id: string): Promise<string> {
    const track = await sqlClient.track.findUnique({
      where: { id: track_id },
    });
    return track?.name ?? "";
  }

  private async getArtistName(track_id: string): Promise<string> {
    const track = await sqlClient.track.findUnique({
      where: { id: track_id },
    });
    return track?.artist ?? "";
  }

  private async getAlbumArtworkFromSpotify(album: Album): Promise<string> {
    const artworkUrl = this.getAlbumArtworkUrl(album);
    const artworkResponse = await fetch(artworkUrl, {
      method: "GET",
      headers: {
        "User-Agent": "NowPlaying/1.0.0",
      },
    });

    if (!artworkResponse.ok) throw new Error(artworkResponse.statusText);
    return new Promise((resolve, reject) => {
      artworkResponse
        .arrayBuffer()
        .then((buffer) => {
          resolve(Buffer.from(buffer).toString("base64"));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getAlbumArtworkUrl(album: Album): string {
    switch (this.config.artworkSize) {
      case "large":
        return album.images[0].url;
      case "medium":
        return album.images[1].url;
      case "small":
        return album.images[2].url;
      default:
        return album.images[0].url;
    }
  }

  private async getTrackInformation(
    accessToken: string,
  ): Promise<CurrentlyPlaying> {
    const url = this.config.currentlyPlayingAddress;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response.data;
  }

  dispose() {
    sqlClient.$disconnect();
  }
}

type TrackState = {
  track_id: string;
  album_id: string;
  artist: string;
};
