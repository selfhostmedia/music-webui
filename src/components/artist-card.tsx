import { ArtistIconImage } from './artist-icon-image';
import type { AlbumArtistDto } from '@/hooks/user/use-library';

export function ArtistCard({
  artist,
  isExpanded,
  onToggle,
}: {
  artist: AlbumArtistDto;
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
          'w-54 lg:w-68',
          'h-68 lg:h-82',
          'p-0 m-0 border-transparent rounded-lg text-left transition-colors',
        ].join(' ')}
      >
        <div
          className={[
            'w-54 lg:w-68',
            'h-54 lg:h-68',
            'bg-accent rounded-lg p-2 shadow-sm shadow-foreground/50 dark:shadow-background',
            'hover:bg-muted-foreground/50 transition-colors',
            isExpanded ? 'bg-muted-foreground/80 transition-colors' : '',
          ].join(' ')}
        >
          <ArtistIconImage
            artistId={artist.id}
            aria-label={`${artist.name}`}
            className="w-50 h-50 lg:w-64 lg:h-64"
            size={200}
          />
        </div>
        <div className="p-2">
          <h3 className="text-center text-sm text-foreground/80">{artist.name}</h3>
        </div>
      </button>
    </>
  );
}
