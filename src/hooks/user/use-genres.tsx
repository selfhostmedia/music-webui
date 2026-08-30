import { useQuery } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListTrackGenresApi = paths['/api/user/list-track-genres']['get'];
type ListTrackGenresWithTracksApi = paths['/api/user/list-track-genres-with-tracks']['get'];

export type TrackGenreDto = ListTrackGenresApi['responses']['200']['content']['application/json']['genres'][0];
export type TrackGenreWithTracksDto =
  ListTrackGenresWithTracksApi['responses']['200']['content']['application/json']['genres'][0];

async function fetchTrackGenres(query?: ListTrackGenresApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-genres', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListTrackGenresApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.genres) {
    throw new Error('No data received');
  }
  return data;
}

async function fetchTrackGenresWithTracks(query?: ListTrackGenresWithTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-track-genres-with-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListTrackGenresWithTracksApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.genres) {
    throw new Error('No data received');
  }
  return data;
}

export function useListTrackGenres(query?: ListTrackGenresApi['parameters']['query']) {
  return useQuery<
    ListTrackGenresApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackGenresApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackGenres', query],
    queryFn: () => fetchTrackGenres(query),
  });
}

export function useListTrackGenresWithTracks(query?: ListTrackGenresWithTracksApi['parameters']['query']) {
  return useQuery<
    ListTrackGenresWithTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTrackGenresWithTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['trackGenresWithTracks', query],
    queryFn: () => fetchTrackGenresWithTracks(query),
  });
}
