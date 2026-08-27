import { AlbumExpandedDetails } from './album-expanded-details';
import type { AlbumArtistWithTracksDto } from '@/hooks/user/use-library';

export function ArtistExpandedDetails({ artist }: { artist: AlbumArtistWithTracksDto }) {
  return (
    <>
      {artist.albums.map((album) => {
        return <AlbumExpandedDetails album={album} />;
      })}
    </>
  );
}
