import { type Artist, type Composer, type Genre, type TrackWithContent, useLibrary } from './library';
import { Button } from '@/components/ui/button';
import { Check, Square } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router';
import { PaginationControls } from '@/components/pagination-controls';
import { PlaybackControls } from '@/components/playback-controls';
import { TrackListItem } from '@/components/track-list-item';
import { formatSlug, secondsToMinutesAndSeconds } from '@/utils/format';
import { startTransition, useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { usePreferences } from '@/hooks/use-preferences';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';

const customStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: 'unset',
      border: 'none',
      borderRight: '1px solid var(--color-muted-foreground)',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'unset',
      border: 'none',
      color: 'var(--color-primary-foreground)',
    },
  },
  rows: {
    style: {
      backgroundColor: 'unset',
      border: 'none',
      color: 'var(--color-primary-foreground)',
    },
  },
  headCells: {
    style: {
      backgroundColor: 'var(--color-card-foreground)',
      border: 'none',
      borderLeft: '1px solid var(--color-muted-foreground)',
      borderBottom: '1px solid var(--color-muted-foreground)',
      borderTop: '1px solid var(--color-muted-foreground)',
      color: 'var(--color-primary-foreground)',
      opacity: 0.75,
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
    },
  },
  cells: {
    style: {
      backgroundColor: 'unset',
      border: 'none',
      borderLeft: '1px solid var(--color-muted-foreground)',
      borderBottom: '1px solid var(--color-muted-foreground)',
      color: 'var(--color-primary-foreground)',
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
  },
};

export default function TracksTable() {
  const { tracks } = useLibrary();
  const isMobile = useIsMobile();
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const { preferences } = usePreferences();
  const { pageSize } = preferences;
  const [page, setPage] = useState(1);

  const allColumns = useMemo<TableColumn<TrackWithContent>[]>(
    () => [
      {
        name: 'Disc',
        width: '50px',
        right: true,
        grow: 0,
        selector: (row: TrackWithContent) => row.discNumber,
        format: (row: TrackWithContent) => <span className="text-xs text-foreground/80">{row.discNumber}</span>,
      },
      {
        name: 'Track',
        width: '60px',
        right: true,
        grow: 0,
        selector: (row: TrackWithContent) => row.trackNumber,
        format: (row: TrackWithContent) => <span className="text-xs text-foreground/80">{row.trackNumber}</span>,
      },
      {
        name: 'Time',
        width: '50px',
        right: true,
        grow: 0,
        selector: (row: TrackWithContent) => row.duration,
        format: (row: TrackWithContent) => (
          <span className="text-xs text-foreground/80">{secondsToMinutesAndSeconds(row.duration)}</span>
        ),
      },
      {
        name: 'Title',
        grow: 2,
        selector: (row: TrackWithContent) => row.title,
        format: (row: TrackWithContent) => <span className="text-xs text-foreground/80">{row.title}</span>,
      },
      {
        name: 'Album',
        grow: 2,
        selector: (row: TrackWithContent) => row.album.title,
        format: (row: TrackWithContent) => (
          <Link to={`/albums/${row.album.id}/${formatSlug(row.album.title)}`}>
            <Button variant="link" className="p-0 text-xs text-foreground/80">
              {row.album.title}
            </Button>
          </Link>
        ),
      },
      {
        name: 'Album Artists',
        grow: 1,
        selector: (row: TrackWithContent) => row.album.artists.map((albumArtist) => albumArtist.name).join(', '),
        format: (row: TrackWithContent) => (
          <ul className="list-none p-0 m-0">
            {row.album.artists.map((artist: Artist) => (
              <li key={`track-artist-${artist.id}`} className="inline-block mr-3 last-of-type:mr-0">
                <Link to={`/album-artists/${artist.id}/${formatSlug(artist.name)}`}>
                  <Button variant="link" className="p-0 text-xs text-foreground/80">
                    {artist.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ),
      },
      {
        name: 'Genres',
        grow: 2,
        selector: (row: TrackWithContent) => row.genres.map((genre) => genre.name).join(', '),
        format: (row: TrackWithContent) => (
          <ul className="list-none p-0 m-0">
            {row.genres.map((genre: Genre) => (
              <li key={`track-genre-${genre.id}`} className="inline-block mr-3 last-of-type:mr-0">
                <Link to={`/track-genres/${genre.id}/${formatSlug(genre.name)}`}>
                  <Button variant="link" className="p-0 text-xs text-foreground/80">
                    {genre.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ),
      },
      {
        name: 'Artists',
        grow: 2,
        selector: (row: TrackWithContent) => row.artists.map((artist) => artist.name).join(', '),
        format: (row: TrackWithContent) => (
          <ul className="list-none p-0 m-0">
            {row.artists.map((artist: Artist) => (
              <li key={`track-artist-${artist.id}`} className="inline-block mr-3 last-of-type:mr-0">
                <Link to={`/track-artists/${artist.id}/${formatSlug(artist.name)}`}>
                  <Button variant="link" className="p-0 text-xs text-foreground/80">
                    {artist.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ),
      },
      {
        name: 'Composers',
        grow: 2,
        selector: (row: TrackWithContent) => row.composers.map((composer) => composer.name).join(', '),
        format: (row: TrackWithContent) => (
          <ul className="list-none p-0 m-0">
            {row.composers.map((composer: Composer) => (
              <li key={`track-composer-${composer.id}`} className="inline-block mr-3 last-of-type:mr-0">
                <Link to={`/track-composers/${composer.id}/${formatSlug(composer.name)}`}>
                  <Button variant="link" className="p-0 text-xs text-foreground/80">
                    {composer.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        ),
      },
      {
        name: '',
        grow: 2,
        selector: () => '',
        format: (row: TrackWithContent) => (
          <div className="text-xs text-foreground/80">
            <PlaybackControls track={row} />
          </div>
        ),
      },
    ],
    [],
  );

  const columns = useMemo(
    () =>
      allColumns.map((column) => ({
        ...column,
        omit: hiddenColumns.has(String(column.name)),
      })),
    [allColumns, hiddenColumns],
  );

  const toggleColumn = (columnName: string) => {
    startTransition(() => {
      setHiddenColumns((previous) => {
        const next = new Set(previous);
        if (next.has(columnName)) {
          next.delete(columnName);
        } else {
          next.add(columnName);
        }
        return next;
      });
    });
  };

  const visibleData = useMemo(() => {
    if (pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return tracks.slice(start, end) || [];
    }
    return tracks;
  }, [tracks, page, pageSize]);

  return (
    <>
      <title>Tracks // SHM</title>
      {isMobile && (
        <ul className="flex grow flex-col">
          {visibleData?.map((item) => (
            <li className="w-full p-2" key={item.filePath}>
              <TrackListItem track={item} />
            </li>
          ))}
        </ul>
      )}
      {!isMobile && (
        <div className="p-4">
          <menu className="mb-4 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="mr-4">Columns</DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  {columns.map((column, index) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={(event) => {
                        event.preventDefault();
                        toggleColumn(String(column.name));
                      }}
                    >
                      {column.omit ? <Square /> : <Check />}
                      {column.name || 'Play actions'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </menu>
          <style>{`
            .rdt_cellBase {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            }
          `}</style>
          <DataTable dense columns={columns} data={visibleData} customStyles={customStyles} />
          <PaginationControls page={page} setPage={setPage} items={tracks?.length ?? 0} />
        </div>
      )}
    </>
  );
}
