import { useQuery } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListTracksApi = paths['/api/user/list-tracks']['get'];

export type TrackDto = ListTracksApi['responses']['200']['content']['application/json']['tracks'][0];

async function fetchTracks(query?: ListTracksApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/list-tracks', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new TypedApiError<ListTracksApi['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.tracks) {
    throw new Error('No data received');
  }
  return data;
}

export function useListTracks(query?: ListTracksApi['parameters']['query']) {
  return useQuery<
    ListTracksApi['responses']['200']['content']['application/json'],
    TypedApiError<ListTracksApi['responses']['400']['content']['application/json']['message']>
  >({
    queryKey: ['tracks', query],
    queryFn: () => fetchTracks(query),
  });
}
