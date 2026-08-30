import { useQuery } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListAlbumsApi = paths['/api/user/list-albums']['get'];
type ListAlbumsWithTracksApi = paths['/api/user/list-albums-with-tracks']['get'];
type RetrieveAlbumApi = paths['/api/user/retrieve-album']['get'];

export type AlbumDto = ListAlbumsApi['responses']['200']['content']['application/json']['albums'][number];
export type AlbumWithTracksDto =
  ListAlbumsWithTracksApi['responses']['200']['content']['application/json']['albums'][number];

async function fetchAlbums(query?: ListAlbumsApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-albums', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListAlbumsApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchAlbumsWithTracks(query?: ListAlbumsWithTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-albums-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListAlbumsWithTracksApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchAlbum(query: RetrieveAlbumApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/retrieve-album', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<RetrieveAlbumApi['responses']['404']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data) {
    throw new Error('No data received');
  }
  return data;
}

export function useAlbums(query?: ListAlbumsApi['parameters']['query']) {
  return useQuery<
    ListAlbumsApi['responses']['200']['content']['application/json'],
    TypedApiError<ListAlbumsApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['albums', query],
    queryFn: () => fetchAlbums(query),
  });
}

export function useAlbumsWithTracks(query?: ListAlbumsWithTracksApi['parameters']['query']) {
  return useQuery<
    ListAlbumsWithTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListAlbumsWithTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['albumsWithTracks', query],
    queryFn: () => fetchAlbumsWithTracks(query),
  });
}

export function useAlbum(query: RetrieveAlbumApi['parameters']['query']) {
  return useQuery<
    RetrieveAlbumApi['responses']['200']['content']['application/json'],
    TypedApiError<RetrieveAlbumApi['responses']['404']['content']['application/json']['message']>
  >({
    queryKey: ['album', query],
    queryFn: () => fetchAlbum(query),
  });
}
