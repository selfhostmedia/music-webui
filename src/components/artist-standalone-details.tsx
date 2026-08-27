import { AlbumStandaloneDetails } from './album-standalone-details';
import type { AlbumArtistWithTracksDto } from '@/hooks/user/use-library';

export function AlbumArtistStandaloneDetails({
  artist,
  onClose,
}: {
  artist: AlbumArtistWithTracksDto;
  onClose: () => void;
}) {
  return artist.albums.map((album) => {
    return <AlbumStandaloneDetails album={album} onClose={onClose} />;
  });
}
