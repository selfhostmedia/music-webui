import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
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

type ListAlbumArtistsEndpoint = paths['/api/user/list-album-artists']['get'];
type ListAlbumArtistsQueryDto = ListAlbumArtistsEndpoint['parameters']['query'];
type ListAlbumArtistsResponseDto = ListAlbumArtistsEndpoint['responses']['200']['content']['application/json'];
export type ListAlbumArtistsErrorCodes =
  GenericErrorCodes | ListAlbumArtistsEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListAlbumArtistsWithTracksEndpoint = paths['/api/user/list-album-artists-with-tracks']['get'];
type ListAlbumArtistsWithTracksQueryDto = ListAlbumArtistsWithTracksEndpoint['parameters']['query'];
type ListAlbumArtistsWithTracksResponseDto =
  ListAlbumArtistsWithTracksEndpoint['responses']['200']['content']['application/json'];
export type ListAlbumArtistsWithTracksErrorCodes =
  | GenericErrorCodes
  | ListAlbumArtistsWithTracksEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListTrackArtistsEndpoint = paths['/api/user/list-track-artists']['get'];
type ListTrackArtistsQueryDto = ListTrackArtistsEndpoint['parameters']['query'];
type ListTrackArtistsResponseDto = ListTrackArtistsEndpoint['responses']['200']['content']['application/json'];
export type ListTrackArtistsErrorCodes =
  GenericErrorCodes | ListTrackArtistsEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListTrackArtistsWithTracksEndpoint = paths['/api/user/list-track-artists-with-tracks']['get'];
type ListTrackArtistsWithTracksQueryDto = ListTrackArtistsWithTracksEndpoint['parameters']['query'];
type ListTrackArtistsWithTracksResponseDto =
  ListTrackArtistsWithTracksEndpoint['responses']['200']['content']['application/json'];
export type ListTrackArtistsWithTracksErrorCodes =
  | GenericErrorCodes
  | ListTrackArtistsWithTracksEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListTrackComposersEndpoint = paths['/api/user/list-track-composers']['get'];
type ListTrackComposersQueryDto = ListTrackComposersEndpoint['parameters']['query'];
type ListTrackComposersResponseDto = ListTrackComposersEndpoint['responses']['200']['content']['application/json'];
export type ListTrackComposersErrorCodes =
  GenericErrorCodes | ListTrackComposersEndpoint['responses']['400']['content']['application/json']['message'][number];

type ListTrackComposersWithTracksEndpoint = paths['/api/user/list-track-composers-with-tracks']['get'];
type ListTrackComposersWithTracksQueryDto = ListTrackComposersWithTracksEndpoint['parameters']['query'];
type ListTrackComposersWithTracksResponseDto =
  ListTrackComposersWithTracksEndpoint['responses']['200']['content']['application/json'];
export type ListTrackComposersWithTracksErrorCodes =
  | GenericErrorCodes
  | ListTrackComposersWithTracksEndpoint['responses']['400']['content']['application/json']['message'][number];

type RetrieveAlbumEndpoint = paths['/api/user/retrieve-album']['get'];
type RetrieveAlbumQueryDto = RetrieveAlbumEndpoint['parameters']['query'];
export type RetrieveAlbumErrorCodes =
  GenericErrorCodes | RetrieveAlbumEndpoint['responses']['404']['content']['application/json']['message'][number];

export type AlbumDto = ListAlbumsResponseDto['albums'][number];
export type AlbumWithTracksDto = ListAlbumsWithTracksResponseDto['albums'][number];
export type AlbumArtistDto = ListAlbumArtistsResponseDto['artists'][number];
export type AlbumArtistWithTracksDto = ListAlbumArtistsWithTracksResponseDto['artists'][number];
export type ArtistDto = ListTrackArtistsResponseDto['artists'][number];
export type ArtistWithTracksDto = ListTrackArtistsWithTracksResponseDto['artists'][number];
export type ComposerDto = ListTrackComposersResponseDto['composers'][number];
export type ComposerWithTracksDto = ListTrackComposersWithTracksResponseDto['composers'][number];
export type TrackDto = AlbumWithTracksDto['tracks'][number];

export type AlbumArtistWithTracksData = {
  artists: AlbumArtistWithTracksDto[];
  total: number;
  offset: number;
};
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
type AlbumArtistsData = {
  artists: AlbumArtistDto[];
  total: number;
  offset: number;
};
type AlbumArtistsWithTracksData = {
  artists: AlbumArtistWithTracksDto[];
  total: number;
  offset: number;
};
export type ArtistsData = {
  artists: ArtistDto[];
  total: number;
  offset: number;
};
export type ArtistsWithTracksData = {
  artists: ArtistWithTracksDto[];
  total: number;
  offset: number;
};
export type ComposersWithTracksData = {
  composers: ComposerWithTracksDto[];
  total: number;
  offset: number;
};
export type ComposersData = {
  composers: ComposerDto[];
  total: number;
  offset: number;
};

const ALBUMS_QUERY_KEY = ['albums'] as const;
const ALBUMS_WITH_TRACKS_QUERY_KEY = ['albumsWithTracks'] as const;
const ALBUM_QUERY_KEY = ['album'] as const;
const ALBUM_ARTISTS_QUERY_KEY = ['albumArtists'] as const;
const ALBUM_ARTISTS_WITH_TRACKS_QUERY_KEY = ['albumArtistsWithTracks'] as const;
const TRACK_ARTISTS_QUERY_KEY = ['trackArtists'] as const;
const TRACK_ARTISTS_WITH_TRACKS_QUERY_KEY = ['trackArtistsWithTracks'] as const;
const TRACK_COMPOSERS_QUERY_KEY = ['composers'] as const;
const TRACK_COMPOSERS_WITH_TRACKS_QUERY_KEY = ['composersWithTracks'] as const;

function albumsWithTracksQueryKey(query?: ListAlbumsWithTracksQueryDto) {
  return [...ALBUMS_WITH_TRACKS_QUERY_KEY, query] as const;
}

function albumsQueryKey(query?: ListAlbumsQueryDto) {
  return [...ALBUMS_QUERY_KEY, query] as const;
}

function albumQueryKey(query: RetrieveAlbumQueryDto) {
  return [...ALBUM_QUERY_KEY, query] as const;
}

function albumArtistsQueryKey(query?: ListAlbumArtistsQueryDto) {
  return [...ALBUM_ARTISTS_QUERY_KEY, query] as const;
}

function albumArtistsWithTracksQueryKey(query?: ListAlbumArtistsWithTracksQueryDto) {
  return [...ALBUM_ARTISTS_WITH_TRACKS_QUERY_KEY, query] as const;
}

function trackArtistsQueryKey(query?: ListTrackArtistsQueryDto) {
  return [...TRACK_ARTISTS_QUERY_KEY, query] as const;
}

function trackArtistsWithTracksQueryKey(query?: ListTrackArtistsWithTracksQueryDto) {
  return [...TRACK_ARTISTS_WITH_TRACKS_QUERY_KEY, query] as const;
}

function trackComposersQueryKey(query?: ListTrackComposersQueryDto) {
  return [...TRACK_COMPOSERS_QUERY_KEY, query] as const;
}

function trackComposersWithTracksQueryKey(query?: ListTrackComposersWithTracksQueryDto) {
  return [...TRACK_COMPOSERS_WITH_TRACKS_QUERY_KEY, query] as const;
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

async function fetchAlbumArtists(query: ListAlbumArtistsQueryDto): Promise<AlbumArtistsData> {
  const { data, error } = await api.get('/api/user/list-album-artists', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return {
    artists: data.artists ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchAlbumArtistsWithTracks(
  query?: ListAlbumArtistsWithTracksQueryDto,
): Promise<AlbumArtistsWithTracksData> {
  const { data, error } = await api.get('/api/user/list-album-artists-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return {
    artists: data.artists ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchTrackArtists(query?: ListTrackArtistsQueryDto): Promise<ArtistsData> {
  const { data, error } = await api.get('/api/user/list-track-artists', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return {
    artists: data.artists ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchTrackArtistsWithTracks(query?: ListTrackArtistsWithTracksQueryDto): Promise<ArtistsWithTracksData> {
  const { data, error } = await api.get('/api/user/list-track-artists-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return {
    artists: data.artists ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchTrackComposers(query?: ListTrackComposersQueryDto): Promise<ComposersData> {
  const { data, error } = await api.get('/api/user/list-track-composers', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.composers) {
    throw new Error('No data received');
  }
  return {
    composers: data.composers ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

async function fetchTrackComposersWithTracks(
  query?: ListTrackComposersWithTracksQueryDto,
): Promise<ComposersWithTracksData> {
  const { data, error } = await api.get('/api/user/list-track-composers-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.composers) {
    throw new Error('No data received');
  }
  return {
    composers: data.composers ?? [],
    total: data.total ?? 0,
    offset: data.offset ?? 0,
  };
}

function fetchAlbumsWithClient(queryClient: QueryClient, query?: ListAlbumsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumsQueryKey(query),
    queryFn: () => fetchAlbums(query),
  });
}

function fetchAlbumsWithTracksWithClient(queryClient: QueryClient, query?: ListAlbumsWithTracksQueryDto) {
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

function fetchAlbumArtistsWithClient(queryClient: QueryClient, query: ListAlbumArtistsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumArtistsQueryKey(query),
    queryFn: () => fetchAlbumArtists(query),
  });
}

function fetchAlbumArtistsWithTracksWithClient(queryClient: QueryClient, query?: ListAlbumArtistsWithTracksQueryDto) {
  return queryClient.fetchQuery({
    queryKey: albumArtistsWithTracksQueryKey(query),
    queryFn: () => fetchAlbumArtistsWithTracks(query),
  });
}

function fetchTrackArtistsWithClient(queryClient: QueryClient, query?: ListTrackArtistsQueryDto) {
  return queryClient.fetchQuery({
    queryKey: trackArtistsQueryKey(query),
    queryFn: () => fetchTrackArtists(query),
  });
}

function fetchTrackArtistsWithTracksWithClient(queryClient: QueryClient, query?: ListTrackArtistsWithTracksQueryDto) {
  return queryClient.fetchQuery({
    queryKey: trackArtistsWithTracksQueryKey(query),
    queryFn: () => fetchTrackArtistsWithTracks(query),
  });
}

function fetchTrackComposersWithClient(queryClient: QueryClient, query?: ListTrackComposersQueryDto) {
  return queryClient.fetchQuery({
    queryKey: trackComposersQueryKey(query),
    queryFn: () => fetchTrackComposers(query),
  });
}

function fetchTrackComposersWithTracksWithClient(
  queryClient: QueryClient,
  query?: ListTrackComposersWithTracksQueryDto,
) {
  return queryClient.fetchQuery({
    queryKey: trackComposersWithTracksQueryKey(query),
    queryFn: () => fetchTrackComposersWithTracks(query),
  });
}

export function useLibrary() {
  const queryClient = useQueryClient();
  // single album
  const [album, setAlbum] = useState<AlbumWithTracksDto | null>(null);
  const [albumLoadingError, setAlbumLoadingError] = useState<Error | null>(null);
  // album list
  const [albums, setAlbums] = useState<AlbumsData>({
    albums: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [isAlbumsLoading, setIsAlbumsLoading] = useState(false);
  const [albumsLoadingError, setAlbumsLoadingError] = useState<Error | null>(null);
  // album list with tracks
  const [albumsWithTracks, setAlbumsWithTracks] = useState<AlbumsWithTracksData>({
    albums: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumsWithTracksLoading, setIsAlbumsWithTracksLoading] = useState(false);
  const [albumsWithTracksLoadingError, setAlbumsWithTracksLoadingError] = useState<Error | null>(null);
  // album artist list
  const [albumArtists, setAlbumArtists] = useState<AlbumArtistsData>({
    artists: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumArtistsLoading, setIsAlbumArtistsLoading] = useState(false);
  const [albumArtistsLoadingError, setAlbumArtistsLoadingError] = useState<Error | null>(null);
  // album artist list with tracks
  const [albumArtistsWithTracks, setAlbumArtistsWithTracks] = useState<AlbumArtistWithTracksData>({
    artists: [],
    total: 0,
    offset: 0,
  });
  const [isAlbumArtistsWithTracksLoading, setIsAlbumArtistsWithTracksLoading] = useState(false);
  const [albumArtistsWithTracksLoadingError, setAlbumArtistsWithTracksLoadingError] = useState<Error | null>(null);
  // track artist list
  const [trackArtists, setTrackArtists] = useState<ArtistsData>({
    artists: [],
    total: 0,
    offset: 0,
  });
  const [isTrackArtistsLoading, setIsTrackArtistsLoading] = useState(false);
  const [trackArtistsLoadingError, setTrackArtistsLoadingError] = useState<Error | null>(null);
  // track artist with tracks list
  const [trackArtistsWithTracks, setTrackArtistsWithTracks] = useState<ArtistsWithTracksData>({
    artists: [],
    total: 0,
    offset: 0,
  });
  const [isTrackArtistsWithTracksLoading, setIsTrackArtistsWithTracksLoading] = useState(false);
  const [trackArtistsWithTracksLoadingError, setTrackArtistsWithTracksLoadingError] = useState<Error | null>(null);
  // track composer list
  const [trackComposers, setTrackComposers] = useState<ComposersData>({
    composers: [],
    total: 0,
    offset: 0,
  });
  const [isTrackComposersLoading, setIsTrackComposersLoading] = useState(false);
  const [trackComposersLoadingError, setTrackComposersLoadingError] = useState<Error | null>(null);
  // track composer list with tracks
  const [trackComposersWithTracks, setTrackComposersWithTracks] = useState<ComposersWithTracksData>({
    composers: [],
    total: 0,
    offset: 0,
  });
  const [isTrackComposersWithTracksLoading, setIsTrackComposersWithTracksLoading] = useState(false);
  const [trackComposersWithTracksLoadingError, setTrackComposersWithTracksLoadingError] = useState<Error | null>(null);

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
    async (query?: ListAlbumsWithTracksQueryDto) => {
      setIsAlbumsWithTracksLoading(true);
      setAlbumsWithTracksLoadingError(null);
      try {
        const result = await fetchAlbumsWithTracksWithClient(queryClient, query);
        setAlbumsWithTracks(result);
        // // set the albums too because the data is the same except for including tracks
        queryClient.setQueryData<AlbumsData>(albumsQueryKey(query), {
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

  const listAlbumArtists = useCallback(
    async (query?: ListAlbumArtistsQueryDto) => {
      setIsAlbumArtistsLoading(true);
      setAlbumArtistsLoadingError(null);
      try {
        const result = await fetchAlbumArtistsWithClient(queryClient, query);
        setAlbumArtists(result);
      } catch (error) {
        setAlbumArtistsLoadingError(error instanceof Error ? error : new Error('Failed to fetch album artists'));
      } finally {
        setIsAlbumArtistsLoading(false);
      }
    },
    [queryClient],
  );

  const listAlbumArtistsWithTracks = useCallback(
    async (query?: ListAlbumArtistsWithTracksQueryDto) => {
      setIsAlbumArtistsWithTracksLoading(true);
      setAlbumArtistsWithTracksLoadingError(null);
      try {
        const result = await fetchAlbumArtistsWithTracksWithClient(queryClient, query);
        setAlbumArtistsWithTracks(result);
      } catch (error) {
        setAlbumArtistsWithTracksLoadingError(
          error instanceof Error ? error : new Error('Failed to fetch album artists with tracks'),
        );
      } finally {
        setIsAlbumArtistsWithTracksLoading(false);
      }
    },
    [queryClient],
  );

  const listTrackArtists = useCallback(
    async (query?: ListTrackArtistsQueryDto) => {
      setIsTrackArtistsLoading(true);
      setTrackArtistsLoadingError(null);
      try {
        const result = await fetchTrackArtistsWithClient(queryClient, query);
        setTrackArtists(result);
      } catch (error) {
        setTrackArtistsLoadingError(error instanceof Error ? error : new Error('Failed to fetch track artists'));
      } finally {
        setIsTrackArtistsLoading(false);
      }
    },
    [queryClient],
  );

  const listTrackArtistsWithTracks = useCallback(
    async (query?: ListTrackArtistsWithTracksQueryDto) => {
      setIsTrackArtistsWithTracksLoading(true);
      setTrackArtistsWithTracksLoadingError(null);
      try {
        const result = await fetchTrackArtistsWithTracksWithClient(queryClient, query);
        setTrackArtistsWithTracks(result);
      } catch (error) {
        setTrackArtistsWithTracksLoadingError(
          error instanceof Error ? error : new Error('Failed to fetch track artists with tracks'),
        );
      } finally {
        setIsTrackArtistsWithTracksLoading(false);
      }
    },
    [queryClient],
  );

  const listTrackComposers = useCallback(
    async (query?: ListTrackComposersQueryDto) => {
      setIsTrackComposersLoading(true);
      setTrackComposersLoadingError(null);
      try {
        const result = await fetchTrackComposersWithClient(queryClient, query);
        setTrackComposers(result);
      } catch (error) {
        setTrackComposersLoadingError(error instanceof Error ? error : new Error('Failed to fetch composers'));
      } finally {
        setIsTrackComposersLoading(false);
      }
    },
    [queryClient],
  );

  const listTrackComposersWithTracks = useCallback(
    async (query?: ListTrackComposersWithTracksQueryDto) => {
      setIsTrackComposersWithTracksLoading(true);
      setTrackComposersWithTracksLoadingError(null);
      try {
        const result = await fetchTrackComposersWithTracksWithClient(queryClient, query);
        setTrackComposersWithTracks(result);
        // // set the composers too because the data is the same except for including tracks
        queryClient.setQueryData<ComposersData>(trackComposersQueryKey(query), {
          total: result.total,
          offset: result.offset,
          composers: result.composers.map((item: ComposerWithTracksDto) => {
            return {
              ...item,
              tracks: undefined,
            };
          }),
        });
      } catch (error) {
        setTrackComposersWithTracksLoadingError(
          error instanceof Error ? error : new Error('Failed to fetch composers with tracks'),
        );
      } finally {
        setIsTrackComposersWithTracksLoading(false);
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

  return {
    listAlbums,
    listAlbumsWithTracks,
    listAlbumArtists,
    listAlbumArtistsWithTracks,
    listTrackArtists,
    listTrackArtistsWithTracks,
    listTrackComposers,
    listTrackComposersWithTracks,
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
    albumArtists: albumArtists.artists,
    albumArtistsTotal: albumArtists.total,
    albumArtistsOffset: albumArtists.offset,
    albumArtistsLoading: isAlbumArtistsLoading,
    albumArtistsError: albumArtistsLoadingError,
    albumArtistsWithTracks: albumArtistsWithTracks.artists,
    albumArtistsWithTracksTotal: albumArtistsWithTracks.total,
    albumArtistsWithTracksOffset: albumArtistsWithTracks.offset,
    albumArtistsWithTracksLoading: isAlbumArtistsWithTracksLoading,
    albumArtistsWithTracksError: albumArtistsWithTracksLoadingError,
    trackArtists: trackArtists.artists,
    trackArtistsTotal: trackArtists.total,
    trackArtistsOffset: trackArtists.offset,
    trackArtistsLoading: isTrackArtistsLoading,
    trackArtistsError: trackArtistsLoadingError,
    trackArtistsWithTracks: trackArtistsWithTracks.artists,
    trackArtistsWithTracksTotal: trackArtistsWithTracks.total,
    trackArtistsWithTracksOffset: trackArtistsWithTracks.offset,
    trackArtistsWithTracksLoading: isTrackArtistsWithTracksLoading,
    trackArtistsWithTracksError: trackArtistsWithTracksLoadingError,
    trackComposers: trackComposers.composers,
    trackComposersTotal: trackComposers.total,
    trackComposersOffset: trackComposers.offset,
    trackComposersLoading: isTrackComposersLoading,
    trackComposersError: trackComposersLoadingError,
    trackComposersWithTracks: trackComposersWithTracks.composers,
    trackComposersWithTracksTotal: trackComposersWithTracks.total,
    trackComposersWithTracksOffset: trackComposersWithTracks.offset,
    trackComposersWithTracksLoading: isTrackComposersWithTracksLoading,
    trackComposersWithTracksError: trackComposersWithTracksLoadingError,
  };
}
