import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { ApiError, type ErrorResponse, getErrorMessage } from '@/lib/api';
import type { paths } from 'src/types/api-schema';

type ListEndpoint = paths['/api/user/list-root-paths']['get'];
type CreateEndpoint = paths['/api/user/create-root-path']['post'];
type DeleteEndpoint = paths['/api/user/delete-root-path']['delete'];

export type RootPathDto = ListEndpoint['responses']['200']['content']['application/json']['rootPaths'][number];
export type CreateBodyDto = CreateEndpoint['requestBody']['content']['application/json'];
export type CreateErrorCodes = CreateEndpoint['responses']['400']['content']['application/json']['message'][number];
export type DeleteQueryDto = DeleteEndpoint['parameters']['query'];
export type DeleteErrorCodes = DeleteEndpoint['responses']['404']['content']['application/json']['message'][number];

type CreateRootPathVariables = {
  body: CreateBodyDto;
};

type DeleteRootPathVariables = {
  query: DeleteQueryDto;
};

const ROOT_PATHS_QUERY_KEY = ['rootPaths'];

async function fetchRootPaths(): Promise<RootPathDto[]> {
  const { data, error } = await api.get('/api/user/list-root-paths', {
    params: { header: api.authHeader() },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.rootPaths) {
    throw new Error('No data received');
  }
  return data.rootPaths;
}

async function createRootPath({ body }: CreateRootPathVariables) {
  const { data, error } = await api.post('/api/user/create-root-path', {
    params: {
      header: api.authHeader(),
    },
    body,
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to create root path');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<CreateErrorCodes>;
    throw new ApiError<CreateErrorCodes>(errorPayload);
  }
  return data;
}

async function deleteRootPath({ query }: DeleteRootPathVariables) {
  const { data, error } = await api.delete('/api/user/delete-root-path', {
    params: {
      header: api.authHeader(),
      query,
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to delete root path');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<DeleteErrorCodes>;
    throw new ApiError<DeleteErrorCodes>(errorPayload);
  }
  return data;
}

export function useRootPaths() {
  const queryClient = useQueryClient();

  const rootPathsQuery = useQuery({
    queryKey: ROOT_PATHS_QUERY_KEY,
    queryFn: fetchRootPaths,
  });

  const createRootPathMutation = useMutation({
    mutationFn: createRootPath,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
  });

  const deleteRootPathMutation = useMutation({
    mutationFn: deleteRootPath,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
  });

  return {
    createRootPath: createRootPathMutation.mutateAsync,
    deleteRootPath: deleteRootPathMutation.mutateAsync,
    refetchRootPaths: rootPathsQuery.refetch,
    isDeleting: deleteRootPathMutation.isPending,
    isLoading: rootPathsQuery.isLoading,
    rootPaths: rootPathsQuery.data ?? [],
  };
}
