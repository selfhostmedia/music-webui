import { Button } from '@/components/ui/button';
import { Check, Square } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Fragment, startTransition, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { type TrackDto, useListTracks } from '@/hooks/user/use-tracks';
import { TrackPlaybackControls } from '@/components/track-playback-controls';
import { formatNumber, formatSlug, secondsToMinutesAndSeconds } from '@/utils/format';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useListFolders } from '@/hooks/user/use-folders';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';

type QueryParameters = NonNullable<Parameters<typeof useListFolders>[0]>;

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

export default function TracksList() {
  const [query] = useState<QueryParameters>();
  const { data, isPending } = useListTracks(query);
  const isMobile = useIsMobile();
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState<number>(100);
  const [page, setPage] = useState(1);

  const allColumns = useMemo<TableColumn<TrackDto>[]>(
    () => [
      {
        name: 'Disc',
        width: '50px',
        right: true,
        grow: 0,
        selector: (row: TrackDto) => row.discNumber,
        format: (row: TrackDto) => <span className="text-xs text-foreground/80">{row.discNumber}</span>,
      },
      {
        name: 'Track',
        width: '60px',
        right: true,
        grow: 0,
        selector: (row: TrackDto) => row.trackNumber,
        format: (row: TrackDto) => <span className="text-xs text-foreground/80">{row.trackNumber}</span>,
      },
      {
        name: 'Time',
        width: '50px',
        right: true,
        grow: 0,
        selector: (row: TrackDto) => row.duration,
        format: (row: TrackDto) => (
          <span className="text-xs text-foreground/80">{secondsToMinutesAndSeconds(row.duration)}</span>
        ),
      },
      {
        name: 'Title',
        grow: 2,
        selector: (row: TrackDto) => row.title,
        format: (row: TrackDto) => <span className="text-xs text-foreground/80">{row.title}</span>,
      },
      {
        name: 'Album',
        grow: 2,
        selector: (row: TrackDto) => row.albumTitle,
        format: (row: TrackDto) => (
          <Link to={`/albums/${row.albumId}/${formatSlug(row.albumTitle)}`}>
            <Button variant="link" className="p-0 text-xs text-foreground/80">
              {row.albumTitle}
            </Button>
          </Link>
        ),
      },
      {
        name: 'Album Artists',
        grow: 1,
        selector: (row: TrackDto) => row.albumArtists.map((albumArtist) => albumArtist.name).join(', '),
        format: (row: TrackDto) => (
          <ul className="list-none p-0 m-0">
            {row.albumArtists.map((artist) => (
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
        selector: (row: TrackDto) => row.genres.map((genre) => genre.name).join(', '),
        format: (row: TrackDto) => (
          <ul className="list-none p-0 m-0">
            {row.genres.map((genre) => (
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
        selector: (row: TrackDto) => row.artists.map((artist) => artist.name).join(', '),
        format: (row: TrackDto) => (
          <ul className="list-none p-0 m-0">
            {row.artists.map((artist) => (
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
        selector: (row: TrackDto) => row.composers.map((composer) => composer.name).join(', '),
        format: (row: TrackDto) => (
          <ul className="list-none p-0 m-0">
            {row.composers.map((composer) => (
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        selector: (row: TrackDto) => '',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        format: (row: TrackDto) => (
          <div className="text-xs text-foreground/80">
            <TrackPlaybackControls />
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

  const toggleQuantity = (num: number) => {
    setQuantity(num);
  };

  const quantities = useMemo(() => [100, 200, 500, 1000, 2000, 100_000], []);
  const pageCount = Math.max(1, Math.ceil((data?.tracks?.length ?? 0) / quantity));

  const visibleData = useMemo(() => {
    const start = (page - 1) * quantity;
    const end = start + quantity;
    return data?.tracks.slice(start, end) || [];
  }, [data?.tracks, page, quantity]);

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([1, page, page - 1, page + 1, pageCount]);

    return [...pages].filter((pageNumber) => pageNumber >= 1 && pageNumber <= pageCount).sort((a, b) => a - b);
  }, [page, pageCount]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
  };

  return (
    <>
      <title>Tracks // SHM</title>

      {isPending && <p>Loading...</p>}

      {isMobile && (
        <ul className="flex grow flex-col">
          {data?.tracks?.map((item) => (
            <li className="w-full p-2" key={item.filePath}>
              {/* Mobile row */}
            </li>
          ))}
        </ul>
      )}

      {!isMobile && (
        <div className="p-4">
          <menu className="mb-4 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="mr-4">
                <Button variant="outline" size="sm">
                  Columns
                </Button>
              </DropdownMenuTrigger>
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
                      {column.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="sm">
                  Rows
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  {quantities.map((num, index) => (
                    <DropdownMenuItem key={index} onSelect={() => toggleQuantity(num)}>
                      {formatNumber(num)}
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
          <div className="m-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={page === 1}
                    className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {pageNumbers.map((pageNumber, index) => {
                  const previousPage = pageNumbers[index - 1];
                  return (
                    <Fragment key={pageNumber}>
                      {previousPage && pageNumber - previousPage > 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === page}
                          onClick={(event) => {
                            event.preventDefault();
                            goToPage(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    </Fragment>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={page === pageCount}
                    className={page === pageCount ? 'pointer-events-none opacity-50' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </>
  );
}
