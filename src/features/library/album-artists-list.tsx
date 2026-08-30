import { AlbumArtistListItem } from '@/components/artist-list-item';
import { AlbumArtistStandaloneDetails } from '@/components/artist-standalone-details';
import { ArtistCard } from '@/components/artist-card';
import { ArtistExpandedDetails } from '@/components/artist-expanded-details';
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useListAlbumArtistsWithTracks } from '@/hooks/user/use-artists';
import { useNavigate, useParams } from 'react-router-dom';

type QueryParameters = NonNullable<Parameters<typeof useListAlbumArtistsWithTracks>[0]>;

const errorMessages: Record<string, string> = {
  'invalid-added-after-error': 'The added-after date is invalid',
  'invalid-added-before-error': 'The added-before date is invalid',
  'invalid-filter-error': 'The filter is invalid',
  'invalid-filter-length-error': 'The filter length is invalid',
  'invalid-genre-error': 'The genre is invalid',
  'invalid-genre-length-error': 'The genre length is invalid',
  'invalid-limit-error': 'The limit is invalid',
  'invalid-limit-range-error': 'The limit is out of range',
  'invalid-offset-error': 'The offset is invalid',
  'invalid-offset-range-error': 'The offset is out of range',
  'invalid-sort-field-error': 'The sort field is invalid',
  'invalid-sort-order-error': 'The sort order is invalid',
  'invalid-year-error': 'The year is invalid',
};

export default function AlbumArtistsList() {
  const navigate = useNavigate();
  const [query] = useState<QueryParameters>({
    offset: 0,
    limit: 100_000,
  });
  const { data, isPending, error } = useListAlbumArtistsWithTracks(query);
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { artistId } = useParams<{ artistId: string }>();
  const expandedArtistId = artistId ? Number(artistId) : null;
  const expandedArtist =
    expandedArtistId !== null ? (data?.artists.find((artist) => artist.id === expandedArtistId) ?? null) : null;
  console.log('expanded artist', expandedArtistId, expandedArtist);

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
        window.removeEventListener('resize', measureColumns);
      };
    }
    return undefined;
  }, [data?.artists.length]);

  function formatSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-+/g, '-');
  }

  function toggleArtist(id: number) {
    if (expandedArtistId === id) {
      navigate('/album-artists');
    } else {
      const artist = data?.artists.find((item) => item.id === id);
      if (!artist) {
        // eslint-disable-next-line no-console
        console.error(`Artist with id ${id} not found`);
        return;
      }
      navigate(`/album-artists/${id}/${formatSlug(artist.name)}`);
    }
  }

  function getErrorMessages() {
    if (!error) {
      return [];
    }
    const messages: string[] = [];
    for (let i = 0; i < error.messages.length; i += 1) {
      const message = error.messages[i];
      messages.push(errorMessages[message] ?? message);
    }
    return messages;
  }

  const clickedArtistIndex = data?.artists.findIndex((item) => item.id === expandedArtistId) ?? -1;
  const detailsInsertIndex =
    clickedArtistIndex >= 0 ? Math.ceil((clickedArtistIndex + 1) / columnSize) * columnSize - 1 : -1;
  const insertingArtist = data?.artists[clickedArtistIndex];

  return (
    <>
      <title>Album artists // SHM</title>
      {isPending && <p>Loading...</p>}
      {error && (
        <ul>
          {getErrorMessages()?.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingArtist && (
            <li className="album-details col-span-full flex flex-col grow  -mx-4">
              {expandedArtist && (
                <AlbumArtistStandaloneDetails artist={expandedArtist} onClose={() => toggleArtist(expandedArtist.id)} />
              )}
            </li>
          )}
          {!insertingArtist &&
            data?.artists.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-album ${item.id}`}>
                  <AlbumArtistListItem
                    artist={item}
                    isExpanded={expandedArtistId === item.id}
                    onToggle={() => toggleArtist(item.id)}
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
          {data?.artists.map((item, index) => {
            const isExpanded = expandedArtistId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={`album ${item.id}`}>
                <li className="w-full h-full inline-block">
                  <ArtistCard artist={item} isExpanded={isExpanded} onToggle={() => toggleArtist(item.id)} />
                </li>
                {shouldInsertDetails && (
                  <li className="album-details col-span-full -mx-4">
                    {expandedArtist && <ArtistExpandedDetails artist={expandedArtist} />}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ul>
      )}
    </>
  );
}
