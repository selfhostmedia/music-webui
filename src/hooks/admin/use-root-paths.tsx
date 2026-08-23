import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { ApiError, type ErrorResponse, type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from 'src/types/api-schema';

type ListEndpoint = paths['/api/admin/list-root-paths']['get'];
type CreateEndpoint = paths['/api/admin/create-root-path']['post'];
type DeleteEndpoint = paths['/api/admin/delete-root-path']['delete'];
type UpdateEndpoint = paths['/api/admin/update-root-path']['patch'];

export type RootPathDto = ListEndpoint['responses']['200']['content']['application/json']['rootPaths'][number];
export type CreateQueryDto = CreateEndpoint['parameters']['query'];
export type CreateBodyDto = CreateEndpoint['requestBody']['content']['application/json'];
export type CreateErrorCodes =
  | GenericErrorCodes
  | CreateEndpoint['responses']['404']['content']['application/json']['message'][number]
  | CreateEndpoint['responses']['400']['content']['application/json']['message'][number];
export type ListQueryDto = ListEndpoint['parameters']['query'];
export type DeleteQueryDto = DeleteEndpoint['parameters']['query'];
export type DeleteErrorCodes =
  GenericErrorCodes | DeleteEndpoint['responses']['404']['content']['application/json']['message'][number];
export type UpdateQueryDto = UpdateEndpoint['parameters']['query'];
export type UpdateBodyDto = UpdateEndpoint['requestBody']['content']['application/json'];
export type UpdateErrorCodes =
  | GenericErrorCodes
  | UpdateEndpoint['responses']['400']['content']['application/json']['message'][number]
  | UpdateEndpoint['responses']['404']['content']['application/json']['message'][number];

type CreateRootPathVariables = {
  query: CreateQueryDto;
  body: CreateBodyDto;
};

type DeleteRootPathVariables = {
  query: DeleteQueryDto;
};

type UpdateRootPathVariables = {
  query: UpdateQueryDto;
  body: UpdateBodyDto;
};

const ROOT_PATHS_QUERY_KEY = ['rootPaths'] as const;

async function fetchRootPathsRequest(): Promise<RootPathDto[]> {
  const { data, error } = await api.get('/api/admin/list-root-paths', {
    params: { header: api.authHeader() },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to fetch root paths');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<GenericErrorCodes>;
    throw new ApiError<GenericErrorCodes>(errorPayload);
  }
  if (!data?.rootPaths) {
    throw new Error(getErrorMessage(data, 'No root paths data received'));
  }
  return data.rootPaths;
}

async function createRootPathRequest({ query, body }: CreateRootPathVariables) {
  const { data, error } = await api.post('/api/admin/create-root-path', {
    params: {
      header: api.authHeader(),
      query,
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

async function deleteRootPathRequest({ query }: DeleteRootPathVariables) {
  const { data, error } = await api.delete('/api/admin/delete-root-path', {
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

async function updateRootPathRequest({ query, body }: UpdateRootPathVariables) {
  const { data, error } = await api.patch('/api/admin/update-root-path', {
    params: {
      header: api.authHeader(),
      query,
    },
    body,
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to update root path');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<UpdateErrorCodes>;
    throw new ApiError<UpdateErrorCodes>(errorPayload);
  }
  return data;
}

export function useRootPaths() {
  const queryClient = useQueryClient();

  const rootPathsQuery = useQuery({
    queryKey: ROOT_PATHS_QUERY_KEY,
    queryFn: fetchRootPathsRequest,
  });

  const createRootPathMutation = useMutation({
    mutationFn: createRootPathRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
  });

  const deleteRootPathMutation = useMutation({
    mutationFn: deleteRootPathRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
  });

  const updateRootPathMutation = useMutation({
    mutationFn: updateRootPathRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ROOT_PATHS_QUERY_KEY });
    },
  });

  return {
    createRootPath: createRootPathMutation.mutateAsync,
    deleteRootPath: deleteRootPathMutation.mutateAsync,
    refetchRootPaths: rootPathsQuery.refetch,
    updateRootPath: updateRootPathMutation.mutateAsync,
    isDeleting: deleteRootPathMutation.isPending,
    isUpdating: updateRootPathMutation.isPending,
    isLoading: rootPathsQuery.isLoading,
    rootPaths: rootPathsQuery.data ?? [],
  };
}
