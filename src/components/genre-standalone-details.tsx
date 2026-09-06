import { AlbumStandaloneDetails } from './album-standalone-details';
import { PlaybackControls } from './playback-controls';
import type { GenreWithContents } from '@/features/library/library';

export function GenreStandaloneDetails({ genre, onClose }: { genre: GenreWithContents; onClose: () => void }) {
  return (
    <>
      <h3 className="text-center text-sm text-foreground/80">{genre.name}</h3>
      <PlaybackControls genre={genre} textLabels={true} />
      {genre.albums.map((album) => {
        return <AlbumStandaloneDetails album={album} onClose={onClose} key={album.id} />;
      })}
    </>
  );
}
