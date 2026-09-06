import { AlbumStandaloneDetails } from './album-standalone-details';
import type { ArtistWithContents } from '@/features/library/library';

export function AlbumArtistStandaloneDetails({ artist, onClose }: { artist: ArtistWithContents; onClose: () => void }) {
  return artist.albums.map((album, index) => {
    return (
      <>
        <AlbumStandaloneDetails album={album} showArtistHeader={index === 0} onClose={onClose} />
      </>
    );
  });
}
