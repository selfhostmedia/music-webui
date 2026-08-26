import { AlbumImage } from './album-image';
import type { AlbumDto } from '@/hooks/user/use-library';

export function AlbumCard({
  album,
  isExpanded,
  onToggle,
}: {
  album: AlbumDto;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={[
          'w-40 md:w-54 lg:w-68',
          'h-54 md:h-68 lg:h-82',
          'p-0 m-0 border-transparent rounded-lg text-left transition-colors',
        ].join(' ')}
      >
        <div
          className={[
            'w-40 md:w-54 lg:w-68',
            'h-40 md:h-54 lg:h-68',
            'bg-accent rounded-lg p-2 shadow-sm shadow-foreground/50 dark:shadow-background',
            'hover:bg-muted-foreground transition-colors',
          ].join(' ')}
        >
          <AlbumImage
            albumId={album.id}
            aria-label={`${album.displayName} by ${album.albumArtists}`}
            className={['w-36 md:w-50 lg:w-64', 'h-36 md:h-50 lg:h-64'].join(' ')}
            size={200}
          />
        </div>
        <div className="p-2">
          <h3 className="text-center text-sm text-foreground/80">{album.displayName}</h3>
          <p className="text-center text-xs text-foreground/60">{album.albumArtists}</p>
        </div>
      </button>
    </>
  );
}
