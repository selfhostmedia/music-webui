import { useQuery } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListTrackComposersApi = paths['/api/user/list-track-composers']['get'];
type ListTrackComposersWithTracksApi = paths['/api/user/list-track-composers-with-tracks']['get'];

export type TrackComposerDto =
  ListTrackComposersApi['responses']['200']['content']['application/json']['composers'][number];
export type TrackComposerWithTracksDto =
  ListTrackComposersWithTracksApi['responses']['200']['content']['application/json']['composers'][number];

async function fetchTrackComposers(query?: ListTrackComposersApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-composers', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListTrackComposersApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.composers) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchTrackComposersWithTracks(query?: ListTrackComposersWithTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-composers-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<
      ListTrackComposersWithTracksApi['responses']['400']['content']['application/json']['message']
    >(error.message, error.error);
  }
  if (!data?.composers) {
    throw new Error('No data received');
  }
  return data;
}

export function useListTrackComposers(query?: ListTrackComposersApi['parameters']['query']) {
  return useQuery<
    ListTrackComposersApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackComposersApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackComposers', query],
    queryFn: () => fetchTrackComposers(query),
  });
}

export function useListTrackComposersWithTracks(query?: ListTrackComposersWithTracksApi['parameters']['query']) {
  return useQuery<
    ListTrackComposersWithTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackComposersWithTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackComposersWithTracks', query],
    queryFn: () => fetchTrackComposersWithTracks(query),
  });
}
