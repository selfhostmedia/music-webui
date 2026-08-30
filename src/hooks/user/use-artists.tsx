import { useQuery } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListAlbumArtistsApi = paths['/api/user/list-album-artists']['get'];
type ListAlbumArtistsWithTracksApi = paths['/api/user/list-album-artists-with-tracks']['get'];
type ListTrackArtistsApi = paths['/api/user/list-track-artists']['get'];
type ListTrackArtistsWithTracksApi = paths['/api/user/list-track-artists-with-tracks']['get'];

export type AlbumArtistDto = ListAlbumArtistsApi['responses']['200']['content']['application/json']['artists'][number];
export type AlbumArtistWithTracksDto =
  ListAlbumArtistsWithTracksApi['responses']['200']['content']['application/json']['artists'][number];
export type TrackArtistDto = ListTrackArtistsApi['responses']['200']['content']['application/json']['artists'][number];
export type TrackArtistWithTracksDto =
  ListTrackArtistsWithTracksApi['responses']['200']['content']['application/json']['artists'][number]; 

async function fetchAlbumArtists(query: ListAlbumArtistsApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-album-artists', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListAlbumArtistsApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchAlbumArtistsWithTracks(query?: ListAlbumArtistsWithTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-album-artists-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<
      ListAlbumArtistsWithTracksApi['responses']['400']['content']['application/json']['message']
    >(error.message, error.error);
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchTrackArtists(query?: ListTrackArtistsApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-artists', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListTrackArtistsApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchTrackArtistsWithTracks(query?: ListTrackArtistsWithTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-artists-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<
      ListTrackArtistsWithTracksApi['responses']['400']['content']['application/json']['message']
    >(error.message, error.error);
  }
  if (!data?.artists) {
    throw new Error('No data received');
  }
  return data;
}

export function useListAlbumArtists(query?: ListAlbumArtistsApi['parameters']['query']) {
  return useQuery<
    ListAlbumArtistsApi['responses']['200']['content']['application/json'],
    TypedApiError<ListAlbumArtistsApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['albumArtists', query],
    queryFn: () => fetchAlbumArtists(query),
  });
}

export function useListAlbumArtistsWithTracks(query?: ListAlbumArtistsWithTracksApi['parameters']['query']) {
  return useQuery<
    ListAlbumArtistsWithTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListAlbumArtistsWithTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['albumArtistsWithTracks', query],
    queryFn: () => fetchAlbumArtistsWithTracks(query),
  });
}

export function useListTrackArtists(query?: ListTrackArtistsApi['parameters']['query']) {
  return useQuery<
    ListTrackArtistsApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackArtistsApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackArtists', query],
    queryFn: () => fetchTrackArtists(query),
  });
}

export function useListTrackArtistsWithTracks(query?: ListTrackArtistsWithTracksApi['parameters']['query']) {
  return useQuery<
    ListTrackArtistsWithTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackArtistsWithTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackArtistsWithTracks', query],
    queryFn: () => fetchTrackArtistsWithTracks(query),
  });
}
