import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { components } from 'src/types/api-schema';

type RootPathDto = components['schemas']['AdminRootPathDto'];
type UpdateBodyDto = components['schemas']['AdminUpdateRootPathBodyDto'];
type CreateBodyDto = components['schemas']['AdminCreateRootPathBodyDto'];

const ROOT_PATHS_QUERY_KEY = ['rootPaths'];

async function fetchRootPaths(): Promise<RootPathDto[]> {
  const { data } = await api.get('/api/admin/list-root-paths', {
    params: { header: api.authHeader() },
  });

  if (!data) throw new Error('No data received');
  return data.rootPaths;
}

export function useRootPaths() {
  const queryClient = useQueryClient();

  const rootPathsQuery = useQuery({
    queryKey: ROOT_PATHS_QUERY_KEY,
    queryFn: fetchRootPaths,
  });

  const createRootPathMutation = useMutation({
    mutationFn: async ({ accountId, body }: { accountId: number; body: CreateBodyDto }) => {
      const { data, error } = await api.post('/api/admin/create-root-path', {
        params: { header: api.authHeader(), query: { accountId } },
        body,
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to add root path');
      }
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to add root path:', error);
    },
  });

  const updateRootPathMutation = useMutation({
    mutationFn: async ({ rootPathId, body }: { rootPathId: number; body: UpdateBodyDto }) => {
      const { data, error } = await api.patch(`/api/admin/update-root-path`, {
        params: {
          header: api.authHeader(),
          query: { id: rootPathId },
        },
        body,
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to update root path');
      }
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to update root path:', error);
    },
  });

  const deleteRootPathMutation = useMutation({
    mutationFn: async (rootPathId: number) => {
      const { data, error } = await api.delete(`/api/admin/delete-root-path`, {
        params: {
          header: api.authHeader(),
          query: { id: rootPathId },
        },
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to delete root path');
      }
      return true;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to delete root path:', error);
    },
  });

  // Keep an API similar to your hook:
  return {
    createRootPath: createRootPathMutation.mutateAsync,
    deleteRootPath: deleteRootPathMutation.mutateAsync,
    refetchRootPaths: rootPathsQuery.refetch,
    updateRootPath: updateRootPathMutation.mutateAsync,
    isDeleting: deleteRootPathMutation.isPending,
    isLoading: rootPathsQuery.isLoading,
    isUpdating: updateRootPathMutation.isPending,
    rootPaths: rootPathsQuery.data ?? [],
  };
}
