import { Button } from '@/components/ui/button';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components';
import { Link } from 'react-router';
import { type TrackDto, useListTracks } from '@/hooks/user/use-tracks';
import { formatSlug, secondsToMinutesAndSeconds } from '@/utils/format';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useListFolders } from '@/hooks/user/use-folders';
import { useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

type QueryParameters = NonNullable<Parameters<typeof useListFolders>[0]>;

export default function TracksList() {
  const [query] = useState<QueryParameters>();
  const { data, isPending } = useListTracks(query);
  const isMobile = useIsMobile();

  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<TrackDto>[]>(
    () => [
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Track',
      },
      {
        id: 'duration',
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ getValue }) => secondsToMinutesAndSeconds(getValue() as number),
      },
      {
        id: 'discNumber',
        accessorKey: 'discNumber',
        header: 'Disc',
      },
      {
        id: 'trackNumber',
        accessorKey: 'trackNumber',
        header: 'Track',
      },
      {
        id: 'albumTitle',
        accessorKey: 'albumTitle',
        header: 'Album',
      },
      {
        id: 'albumArtists',
        accessorKey: 'albumArtists',
        header: 'Album Artists',
        cell: ({ getValue }) => {
          const albumArtists = getValue() as { id: string; name: string }[];

          return (
            <>
              {albumArtists.map((artist) => (
                <li key={`track-artist-${artist.id}`} className="mr-2 mb-2 inline-block">
                  <Link to={`/album-artists/${artist.id}/${formatSlug(artist.name)}`}>
                    <Button variant="link" className="px-2 py-0 text-xs">
                      {artist.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </>
          );
        },
      },
      {
        id: 'genres',
        accessorKey: 'genres',
        header: 'Genres',
        cell: ({ getValue }) => {
          const genres = getValue() as { id: string; name: string }[];

          return (
            <>
              {genres.map((genre) => (
                <li key={`track-genre-${genre.id}`} className="mr-2 mb-2 inline-block">
                  <Link to={`/track-genres/${genre.id}/${formatSlug(genre.name)}`}>
                    <Button variant="link" className="px-2 py-0 text-xs">
                      {genre.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </>
          );
        },
      },
      {
        id: 'artists',
        accessorKey: 'artists',
        header: 'Artists',
        cell: ({ getValue }) => {
          const artists = getValue() as { id: string; name: string }[];
          return (
            <>
              {artists.map((artist) => (
                <li key={`track-artist-${artist.id}`} className="mr-2 mb-2 inline-block">
                  <Link to={`/track-artists/${artist.id}/${formatSlug(artist.name)}`}>
                    <Button variant="link" className="px-2 py-0 text-xs">
                      {artist.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </>
          );
        },
      },
      {
        id: 'composers',
        accessorKey: 'composers',
        header: 'Composers',
        cell: ({ getValue }) => {
          const composers = getValue() as { id: string; name: string }[];
          return (
            <>
              {composers.map((composer) => (
                <li key={`track-composer-${composer.id}`} className="mr-2 mb-2 inline-block">
                  <Link to={`/track-composers/${composer.id}/${formatSlug(composer.name)}`}>
                    <Button variant="link" className="px-2 py-0 text-xs">
                      {composer.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data?.tracks ?? [],
    columns,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 10,

    // Necessary because rows can have different heights.
    measureElement: (element) => element.getBoundingClientRect().height,
  });

  const gridTemplateColumns = table
    .getVisibleLeafColumns()
    .map((column) => `${column.getSize()}px`)
    .join(' ');

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
          <div ref={parentRef} className="h-[calc(100vh-10rem)] overflow-auto">
            <DataTable className="w-full">
              <DataTableHeader
                className="sticky top-0 z-10 bg-background text-xs"
                style={{
                  display: 'grid',
                  gridTemplateColumns,
                }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <DataTableRow
                    key={headerGroup.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns,
                    }}
                  >
                    {headerGroup.headers.map((header) => (
                      <DataTableHeaderCell
                        key={header.id}
                        colSpan={header.colSpan}
                        className="relative"
                        style={{
                          width: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getCanResize() && (
                          <div
                            className={`absolute inset-y-0 right-0 w-2 cursor-col-resize touch-none select-none 
                              hover:bg-primary ${header.column.getIsResizing() ? 'bg-primary opacity-80' : ''}`}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            onDoubleClick={() => header.column.resetSize()}
                          />
                        )}
                      </DataTableHeaderCell>
                    ))}
                  </DataTableRow>
                ))}
              </DataTableHeader>

              <DataTableBody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: 'relative',
                  display: 'block',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const row = rows[virtualRow.index];

                  return (
                    <DataTableRow
                      key={row.id}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                        display: 'grid',
                        tableLayout: 'fixed',
                        gridTemplateColumns,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <DataTableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </DataTableCell>
                      ))}
                    </DataTableRow>
                  );
                })}
              </DataTableBody>
            </DataTable>
          </div>
        </div>
      )}
    </>
  );
}
