import { AlbumExpandedDetails } from './album-expanded-details';
import type { TrackGenreWithTracksDto } from '@/hooks/user/use-genres';

export function GenreExpandedDetails({ genre }: { genre: TrackGenreWithTracksDto }) {
  return (
    <>
      {genre.albums.map((album) => {
        return <AlbumExpandedDetails album={album} key={album.id} />;
      })}
    </>
  );
}
