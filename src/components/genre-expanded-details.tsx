import { AlbumExpandedDetails } from './album-expanded-details';
import { PlaybackControls } from './playback-controls';
import type { GenreWithContents } from '@/features/library/library';

export function GenreExpandedDetails({ genre }: { genre: GenreWithContents }) {
  const contrastingColor = genre.albums[0].coverImageVibrant || '#000000';
  return (
    <div
      className="relative w-full min-h-120"
      style={{
        backgroundColor: contrastingColor,
      }}
    >
      <div
        className="p-2 bg-muted/50"
        style={{
          backgroundColor: contrastingColor,
        }}
      >
        <h3 className="text-xl ml-2 text-foreground/80">{genre.name}</h3>
        {genre.albums.length > 1 && <PlaybackControls genre={genre} textLabels={true} />}
      </div>
      {genre.albums.map((album, index) => {
        const firstInstanceOfArtist =
          index ===
          genre.albums.findIndex(
            (item) =>
              item.artists.map((artist) => artist.name).join(',') ===
              genre.albums[index].artists.map((artist) => artist.name).join(','),
          );
        return (
          <AlbumExpandedDetails
            album={album}
            key={`album${album.id}-${index}`}
            showArtistHeader={firstInstanceOfArtist}
          />
        );
      })}
    </div>
  );
}
