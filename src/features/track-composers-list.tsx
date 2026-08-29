import { AlbumArtistListItem } from '@/components/artist-list-item';
import { AlbumArtistStandaloneDetails } from '@/components/artist-standalone-details';
import { ArtistExpandedDetails } from '@/components/artist-expanded-details';
import { ComposerCard } from '@/components/composer-card';
import { ComposerSortFieldEnum, SortDirectionEnum } from '@/types/api-schema';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLibrary } from '@/hooks/user/use-library';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrackComposersList() {
  const navigate = useNavigate();
  const {
    listTrackComposersWithTracks,
    trackComposersWithTracks,
    trackComposersWithTracksTotal,
    trackComposersWithTracksOffset,
    trackComposersWithTracksLoading,
    trackComposersWithTracksError,
  } = useLibrary();
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { composerId } = useParams<{ composerId: string }>();
  const expandedComposerId = composerId ? Number(composerId) : null;
  const expandedComposer =
    expandedComposerId !== null
      ? (trackComposersWithTracks.find((composer) => composer.id === expandedComposerId) ?? null)
      : null;

  useLayoutEffect(() => {
    const list = listRef.current as HTMLElement | null;
    if (list) {
      const measureColumns = () => {
        const items = Array.from(list.querySelectorAll<HTMLElement>('li')) as HTMLElement[];
        if (items.length > 0) {
          const firstItem = items[0];
          let interruptedByExpandedAlbum = -1;
          for (let i = 1; i < items.length; i += 1) {
            const item = items[i];
            if (item.classList.contains('album-details')) {
              interruptedByExpandedAlbum = i;
              break;
            }
            if (item.offsetTop > firstItem.offsetTop) {
              setColumnSize(i);
              break;
            }
          }
          // find the first row-starting element after the expanded album details
          if (interruptedByExpandedAlbum > -1) {
            let newFirstItem = -1;
            for (let i = interruptedByExpandedAlbum + 1; i < items.length; i += 1) {
              const item = items[i];
              if (item.offsetLeft === firstItem.offsetLeft) {
                newFirstItem = i;
                break;
              }
            }
            // measure the column size starting from the new first item
            if (newFirstItem > -1) {
              const newFirst = items[newFirstItem];
              for (let i = newFirstItem + 1; i < items.length; i += 1) {
                const item = items[i];
                if (item.offsetTop > newFirst.offsetTop) {
                  const newColumnSize = i - newFirstItem;
                  if (newColumnSize > 0) {
                    setColumnSize(newColumnSize);
                  }
                  break;
                }
              }
            }
          }
        }
      };
      measureColumns();
      const observer = new ResizeObserver(measureColumns);
      observer.observe(list);
      window.addEventListener('resize', measureColumns);
      return () => {
        observer.disconnect();
        // window.removeEventListener('resize', measureColumns);
      };
    }
    return undefined;
  }, [trackComposersWithTracks.length]);

  function formatSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-+/g, '-');
  }

  function toggleComposer(id: number) {
    if (expandedComposerId === id) {
      navigate('/trakc-composers');
    } else {
      const composer = trackComposersWithTracks.find((item) => item.id === id);
      if (!composer) {
        // eslint-disable-next-line no-console
        console.error(`Composer with id ${id} not found`);
        return;
      }
      navigate(`/track-composers/${id}/${formatSlug(composer.name)}`);
    }
  }

  const clickedArtistIndex = trackComposersWithTracks.findIndex((item) => item.id === expandedComposerId);
  const detailsInsertIndex =
    clickedArtistIndex >= 0 ? Math.ceil((clickedArtistIndex + 1) / columnSize) * columnSize - 1 : -1;
  const insertingComposer = trackComposersWithTracks[clickedArtistIndex];

  useEffect(() => {
    listTrackComposersWithTracks({
      sortField: ComposerSortFieldEnum.composer,
      sortDirection: SortDirectionEnum.asc,
    });
  }, [listTrackComposersWithTracks]);

  return (
    <>
      <title>Composers // SHM</title>
      {trackComposersWithTracksLoading && <p>Loading...</p>}
      {trackComposersWithTracksError && <p>Error: {trackComposersWithTracksError.message}</p>}
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingComposer && (
            <li className="album-details col-span-full flex flex-col grow  -mx-4">
              {expandedComposer && (
                <AlbumArtistStandaloneDetails
                  artist={expandedComposer}
                  onClose={() => toggleComposer(expandedComposer.id)}
                />
              )}
            </li>
          )}
          {!insertingComposer &&
            trackComposersWithTracks.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-album ${item.id}`}>
                  <AlbumArtistListItem
                    artist={item}
                    isExpanded={expandedComposerId === item.id}
                    onToggle={() => toggleComposer(item.id)}
                  />
                </li>
              );
            })}
        </ul>
      )}
      {!isMobile && (
        <ul
          ref={listRef}
          className={[
            'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]',
            'md:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]',
            'lg:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] ',
            'gap-4 mx-4',
          ].join(' ')}
        >
          {trackComposersWithTracks.map((item, index) => {
            const isExpanded = expandedComposerId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={`composer ${item.id}`}>
                <li className="w-full h-full inline-block">
                  <ComposerCard composer={item} isExpanded={isExpanded} onToggle={() => toggleComposer(item.id)} />
                </li>
                {shouldInsertDetails && (
                  <li className="album-details col-span-full -mx-4">
                    {expandedComposer && <ArtistExpandedDetails artist={expandedComposer} />}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ul>
      )}
      {/* pagination */}
      <div>
        <p>
          Showing {trackComposersWithTracksOffset + 1}
          to {Math.min(trackComposersWithTracksOffset + trackComposersWithTracks.length, trackComposersWithTracksTotal)}
          of {trackComposersWithTracksTotal} composers
        </p>
      </div>
    </>
  );
}
