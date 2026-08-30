import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListFoldersApi = paths['/api/user/folder-structure']['get'];

export type TreeItemDto = ListFoldersApi['responses']['200']['content']['application/json']['items'][number];

async function fetchFolders(query?: ListFoldersApi['parameters']['query']) {
  const { data, error } = await api.get('/api/user/folder-structure', {
    params: {
      query,
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(error);
  }
  if (!data?.items) {
    throw new Error('No data received');
  }
  return data;
}

export function useListFolders(query?: ListFoldersApi['parameters']['query']) {
  return useQuery<ListFoldersApi['responses']['200']['content']['application/json']>({
    queryKey: ['folders', query],
    queryFn: () => fetchFolders(query),
  });
}
