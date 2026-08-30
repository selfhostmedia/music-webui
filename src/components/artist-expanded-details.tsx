import { AlbumExpandedDetails } from './album-expanded-details';
import type { AlbumArtistWithTracksDto } from '@/hooks/user/use-artists';

export function ArtistExpandedDetails({ artist }: { artist: AlbumArtistWithTracksDto }) {
  return (
    <>
      {artist.albums.map((album) => {
        return <AlbumExpandedDetails album={album} />;
      })}
    </>
  );
}
