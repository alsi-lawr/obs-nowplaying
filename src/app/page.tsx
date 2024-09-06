import AlbumArtwork from "./components/artwork/AlbumArtwork";
import SongDetails from "./components/songdetails/SongDetails";

export default function Home() {
  return (
    <div className="container">
      <AlbumArtwork src="assets/Snip_Artwork.jpg" />
      <SongDetails
        artist="assets/Snip_Artist.txt"
        title="assets/Snip_Track.txt"
      />
    </div>
  );
}
