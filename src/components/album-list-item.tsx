import { AlbumIconImage } from './album-icon-image';
import type { AlbumDto } from '@/hooks/user/use-library';

export function AlbumListItem({
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
        className="w-full p-0 m-0 border-transparent rounded-lg text-left transition-colors"
      >
        <div
          className={[
            'flex flex-row',
            'bg-accent rounded-lg p-2 shadow-sm shadow-foreground/50 dark:shadow-background',
            'hover:bg-muted-foreground/50 transition-colors',
            isExpanded ? 'bg-muted-foreground/80 transition-colors' : '',
          ].join(' ')}
        >
          <AlbumIconImage
            albumId={album.id}
            aria-label={`${album.displayName} by ${album.albumArtists}`}
            className="w-30 h-30 mr-2"
            size={100}
          />
          <div>
            <h3 className="text-foreground/80">{album.displayName}</h3>
            <p className="text-sm text-foreground/60">{album.albumArtists}</p>
          </div>
        </div>
      </button>
    </>
  );
}
