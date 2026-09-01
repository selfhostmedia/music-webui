import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { GenreCard } from '@/components/genre-card';
import { GenreExpandedDetails } from '@/components/genre-expanded-details';
import { GenreListItem } from '@/components/genre-list-item';
import { GenreStandaloneDetails } from '@/components/genre-standalone-details';
import { formatSlug } from '@/utils/format';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useListTrackGenresWithTracks } from '@/hooks/user/use-genres';
import { useNavigate, useParams } from 'react-router-dom';

type QueryParameters = NonNullable<Parameters<typeof useListTrackGenresWithTracks>[0]>;

const errorMessages: Record<string, string> = {
  'invalid-added-after-error': 'The added-after date is invalid',
  'invalid-added-before-error': 'The added-before date is invalid',
  'invalid-filter-error': 'The filter is invalid',
  'invalid-filter-length-error': 'The filter length is invalid',
  'invalid-limit-error': 'The limit is invalid',
  'invalid-limit-range-error': 'The limit is out of range',
  'invalid-offset-error': 'The offset is invalid',
  'invalid-offset-range-error': 'The offset is out of range',
  'invalid-sort-field-error': 'The sort field is invalid',
  'invalid-sort-order-error': 'The sort order is invalid',
  'invalid-year-error': 'The year is invalid',
};

export default function TrackGenresList() {
  const navigate = useNavigate();
  const [query] = useState<QueryParameters>({
    offset: 0,
    limit: 100_000,
  });
  const { data, isPending, error } = useListTrackGenresWithTracks(query);
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { genreId } = useParams<{ genreId: string }>();
  const expandedGenreId = genreId ? Number(genreId) : null;
  const expandedGenre =
    expandedGenreId !== null ? (data?.genres.find((genre) => genre.id === expandedGenreId) ?? null) : null;

  useLayoutEffect(() => {
    const list = listRef.current as HTMLElement | null;
    if (list) {
      const measureColumns = () => {
        const items = Array.from(list.querySelectorAll<HTMLElement>('li')) as HTMLElement[];
        if (items.length > 0) {
          const firstItem = items[0];
          let interruptedByExpandedGenre = -1;
          for (let i = 1; i < items.length; i += 1) {
            const item = items[i];
            if (item.classList.contains('genre-details')) {
              interruptedByExpandedGenre = i;
              break;
            }
            if (item.offsetTop > firstItem.offsetTop) {
              setColumnSize(i);
              break;
            }
          }
          // find the first row-starting element after the expanded album details
          if (interruptedByExpandedGenre > -1) {
            let newFirstItem = -1;
            for (let i = interruptedByExpandedGenre + 1; i < items.length; i += 1) {
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
  }, [data?.genres.length]);

  function toggleGenre(id: number) {
    if (expandedGenreId === id) {
      navigate('/track-genres');
    } else {
      const genre = data?.genres.find((item) => item.id === id);
      if (!genre) {
        // eslint-disable-next-line no-console
        console.error(`Genre with id ${id} not found`);
        return;
      }
      navigate(`/track-genres/${id}/${formatSlug(genre.name)}`);
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

  const clickedGenreIndex = data?.genres.findIndex((item) => item.id === expandedGenreId) ?? -1;
  let detailsInsertIndex =
    clickedGenreIndex >= 0 ? Math.ceil((clickedGenreIndex + 1) / columnSize) * columnSize - 1 : -1;
  if (data?.genres.length) {
    if (detailsInsertIndex > data.genres.length) {
      detailsInsertIndex = data.genres.length - 1;
    }
  }
  const insertingGenre = data?.genres[clickedGenreIndex];

  return (
    <>
      <title>Track Genres // SHM</title>
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
          {insertingGenre && (
            <li className="genre-details col-span-full flex flex-col grow  -mx-4">
              {expandedGenre && (
                <GenreStandaloneDetails genre={expandedGenre} onClose={() => toggleGenre(expandedGenre.id)} />
              )}
            </li>
          )}
          {!insertingGenre &&
            data?.genres.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-genre ${item.id}`}>
                  <GenreListItem
                    genre={item}
                    isExpanded={expandedGenreId === item.id}
                    onToggle={() => toggleGenre(item.id)}
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
          {data?.genres.map((item, index) => {
            const isExpanded = expandedGenreId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={`track-genre ${item.id}`}>
                <li className="w-full h-full inline-block">
                  <GenreCard genre={item} isExpanded={isExpanded} onToggle={() => toggleGenre(item.id)} />
                </li>
                {shouldInsertDetails && (
                  <li className="genre-details col-span-full -mx-4">
                    {expandedGenre && <GenreExpandedDetails genre={expandedGenre} />}
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
