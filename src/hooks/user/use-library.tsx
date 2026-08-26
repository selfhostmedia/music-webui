import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import api, { type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from 'src/types/api-schema';

type ListAlbumsEndpoint = paths['/api/user/list-albums']['get'];
type ListAlbumsQueryDto = ListAlbumsEndpoint['parameters']['query'];
type ListAlbumsResponseDto = ListAlbumsEndpoint['responses']['200']['content']['application/json'];
export type ListAlbumsErrorCodes =
  GenericErrorCodes | ListAlbumsEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListAlbumsWithTracksEndpoint = paths['/api/user/list-albums-with-tracks']['get'];
type ListAlbumsWithTracksQueryDto = ListAlbumsWithTracksEndpoint['parameters']['query'];
type ListAlbumsWithTracksResponseDto = ListAlbumsWithTracksEndpoint['responses']['200']['content']['application/json'];
export type ListAlbumsWithTracksErrorCodes =
  | GenericErrorCodes
  | ListAlbumsWithTracksEndpoint['responses']['400']['content']['application/json']['message'][number];

type RetrieveAlbumEndpoint = paths['/api/user/retrieve-album']['get'];
type RetrieveAlbumQueryDto = RetrieveAlbumEndpoint['parameters']['query'];
export type RetrieveAlbumErrorCodes =
  GenericErrorCodes | RetrieveAlbumEndpoint['responses']['404']['content']['application/json']['message'][number];

export type AlbumDto = ListAlbumsResponseDto['albums'][number];
export type AlbumWithTracksDto = ListAlbumsWithTracksResponseDto['albums'][number];
export type TrackDto = AlbumWithTracksDto['tracks'][number];

type AlbumsData = {
  albums: AlbumDto[];
  total: number;
  offset: number;
};

type AlbumsWithTracksData = {
  albums: AlbumWithTracksDto[];
  total: number;
  offset: number;
};

const ALBUMS_QUERY_KEY = ['albums'] as const;
const ALBUMS_WITH_TRACKS_QUERY_KEY = ['albumsWithTracks'] as const;
const ALBUM_QUERY_KEY = ['album'] as const;

function albumsWithTracksQueryKey(query?: ListAlbumsWithTracksQueryDto) {
  return [...ALBUMS_WITH_TRACKS_QUERY_KEY, query] as const;
}

function albumsQueryKey(query?: ListAlbumsQueryDto) {
  return [...ALBUMS_QUERY_KEY, query] as const;
}

function albumQueryKey(query: RetrieveAlbumQueryDto) {
  return [...ALBUM_QUERY_KEY, query] as const;
}

async function fetchAlbums(query?: ListAlbumsQueryDto): Promise<AlbumsData> {
  const { data, error } = await api.get('/api/user/list-albums', {
    params: {
      query,
      header: api.authHeader(),
    },
  });

  if (error) {
    throw new Error(getErrorMessage(error));
  }

  if (!data) {
    throw new Error('No data received');
  }

  return {
    albums: data.albums ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchAlbumsWithTracks(query?: ListAlbumsWithTracksQueryDto): Promise<AlbumsWithTracksData> {
  const { data, error } = await api.get('/api/user/list-albums-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('No data received');
  }
  return {
    albums: data.albums ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchAlbum(query: RetrieveAlbumQueryDto): Promise<AlbumWithTracksDto> {
  const { data, error } = await api.get('/api/user/retrieve-album', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.album) {
    throw new Error('No data received');
  }
  return data.album;
}

function fetchAlbumsWithClient(queryClient: QueryClient, query?: ListAlbumsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumsQueryKey(query),
    queryFn: () => fetchAlbums(query),
  });
}

function fetchAlbumsWithTracksWithClient(queryClient: QueryClient, query?: ListAlbumsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumsWithTracksQueryKey(query),
    queryFn: () => fetchAlbumsWithTracks(query),
  });
}

function fetchAlbumWithClient(queryClient: QueryClient, query: RetrieveAlbumQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumQueryKey(query),
    queryFn: () => fetchAlbum(query),
  });
}

export function useLibrary() {
  const queryClient = useQueryClient();

  const [album, setAlbum] = useState<AlbumWithTracksDto | null>(null);
  const [albumLoadingError, setAlbumLoadingError] = useState<Error | null>(null);

  const [albums, setAlbums] = useState<AlbumsData>({
    albums: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [isAlbumsLoading, setIsAlbumsLoading] = useState(false);
  const [albumsLoadingError, setAlbumsLoadingError] = useState<Error | null>(null);

  const [albumsWithTracks, setAlbumsWithTracks] = useState<AlbumsWithTracksData>({
    albums: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumsWithTracksLoading, setIsAlbumsWithTracksLoading] = useState(false);
  const [albumsWithTracksLoadingError, setAlbumsWithTracksLoadingError] = useState<Error | null>(null);

  const listAlbums = useCallback(
    async (query?: ListAlbumsQueryDto) => {
      setIsAlbumsLoading(true);
      setAlbumsLoadingError(null);
      try {
        const result = await fetchAlbumsWithClient(queryClient, query);
        setAlbums(result);
      } catch (error) {
        setAlbumsLoadingError(error instanceof Error ? error : new Error('Failed to fetch albums'));
      } finally {
        setIsAlbumsLoading(false);
      }
    },
    [queryClient],
  );

  const listAlbumsWithTracks = useCallback(
    async (query?: ListAlbumsQueryDto) => {
      setIsAlbumsWithTracksLoading(true);
      setAlbumsWithTracksLoadingError(null);
      try {
        const result = await fetchAlbumsWithTracksWithClient(queryClient, query);
        setAlbumsWithTracks(result);
        // set the albums too because the data is the same except for including tracks
        setAlbums({
          total: result.total,
          offset: result.offset,
          albums: result.albums.map((item: AlbumWithTracksDto) => {
            return {
              ...item,
              tracks: undefined,
            };
          }),
        });
      } catch (error) {
        setAlbumsWithTracksLoadingError(
          error instanceof Error ? error : new Error('Failed to fetch albums with tracks'),
        );
      } finally {
        setIsAlbumsWithTracksLoading(false);
      }
    },
    [queryClient],
  );

  const retrieveAlbum = useCallback(
    async (query: RetrieveAlbumQueryDto) => {
      try {
        setIsAlbumLoading(true);
        const result = await fetchAlbumWithClient(queryClient, query);
        setAlbum(result);
      } catch (error) {
        setAlbumLoadingError(error instanceof Error ? error : new Error('Failed to fetch album'));
      } finally {
        setIsAlbumLoading(false);
      }
    },
    [queryClient],
  );

  useEffect(() => {
    listAlbumsWithTracks();
  }, []);

  return {
    listAlbums,
    listAlbumsWithTracks,
    retrieveAlbum,
    albums: albums.albums,
    albumsTotal: albums.total,
    albumsOffset: albums.offset,
    albumsLoading: isAlbumsLoading,
    albumsError: albumsLoadingError,
    albumsWithTracks: albumsWithTracks.albums,
    albumsWithTracksTotal: albumsWithTracks.total,
    albumsWithTracksOffset: albumsWithTracks.offset,
    albumsWithTracksLoading: isAlbumsWithTracksLoading,
    albumsWithTracksError: albumsWithTracksLoadingError,
    album,
    albumLoading: isAlbumLoading,
    albumError: albumLoadingError,
  };
}
