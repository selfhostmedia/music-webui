import { AlbumStandaloneDetails } from './album-standalone-details';
import type { TrackGenreWithTracksDto } from '@/hooks/user/use-genres';

export function GenreStandaloneDetails({ genre, onClose }: { genre: TrackGenreWithTracksDto; onClose: () => void }) {
  return genre.albums.map((album) => {
    return <AlbumStandaloneDetails album={album} onClose={onClose} />;
  });
}
