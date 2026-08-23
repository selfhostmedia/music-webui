import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api, { ApiError, type ErrorResponse, type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type ListEndpoint = paths['/api/admin/list-accounts']['get'];
type CreateEndpoint = paths['/api/admin/create-account']['post'];
type DeleteEndpoint = paths['/api/admin/delete-account']['delete'];
type RegenerateSessionKeyEndpoint = paths['/api/admin/regenerate-user-session-key']['post'];
type ResetPasswordEndpoint = paths['/api/admin/reset-user-password']['post'];
type UpdateRolesEndpoint = paths['/api/admin/update-user-roles']['patch'];

export type AccountDto = ListEndpoint['responses']['200']['content']['application/json']['accounts'][number];
export type CreateAccountBodyDto = CreateEndpoint['requestBody']['content']['application/json'];
export type CreateAccountErrorCodes =
  GenericErrorCodes | CreateEndpoint['responses']['400']['content']['application/json']['message'][number];
export type DeleteAccountQueryDto = DeleteEndpoint['parameters']['query'];
export type DeleteAccountErrorCodes =
  | GenericErrorCodes
  | DeleteEndpoint['responses']['400']['content']['application/json']['message'][number]
  | DeleteEndpoint['responses']['404']['content']['application/json']['message'][number];
export type RegenerateSessionKeyQueryDto = RegenerateSessionKeyEndpoint['parameters']['query'];
export type RegenerateSessionKeyErrorCodes =
  | GenericErrorCodes
  | RegenerateSessionKeyEndpoint['responses']['404']['content']['application/json']['message'][number];
export type ResetPasswordQueryDto = ResetPasswordEndpoint['parameters']['query'];
export type ResetPasswordBodyDto = ResetPasswordEndpoint['requestBody']['content']['application/json'];
export type ResetPasswordErrorCodes =
  | GenericErrorCodes
  | ResetPasswordEndpoint['responses']['400']['content']['application/json']['message'][number]
  | ResetPasswordEndpoint['responses']['404']['content']['application/json']['message'][number];
export type UpdateRolesQueryDto = UpdateRolesEndpoint['parameters']['query'];
export type UpdateRolesBodyDto = UpdateRolesEndpoint['requestBody']['content']['application/json'];
export type UpdateRolesErrorCodes =
  | GenericErrorCodes
  | UpdateRolesEndpoint['responses']['400']['content']['application/json']['message'][number]
  | UpdateRolesEndpoint['responses']['404']['content']['application/json']['message'][number];

type CreateAccountVariables = {
  body: CreateAccountBodyDto;
};
type DeleteAccountVariables = {
  query: DeleteAccountQueryDto;
};
type UpdateRolesVariables = {
  query: UpdateRolesQueryDto;
  body: UpdateRolesBodyDto;
};
type ResetPasswordVariables = {
  query: ResetPasswordQueryDto;
  body: ResetPasswordBodyDto;
};

const ACCOUNTS_QUERY_KEY = ['accounts'] as const;

async function fetchAccounts(): Promise<AccountDto[]> {
  const { data, error } = await api.get('/api/admin/list-accounts', {
    params: { header: api.authHeader() },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to fetch accounts');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<GenericErrorCodes>;
    throw new ApiError<GenericErrorCodes>(errorPayload);
  }
  if (!data?.accounts) {
    throw new Error(getErrorMessage(data, 'No accounts data received'));
  }
  return data.accounts;
}

async function createAccountRequest({ body }: CreateAccountVariables) {
  const { data, error } = await api.post('/api/admin/create-account', {
    params: {
      header: api.authHeader(),
    },
    body,
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to create account');
  }
  if (!data.success) {
    const errorPayload = data as unknown as ErrorResponse<CreateAccountErrorCodes>;
    throw new ApiError<CreateAccountErrorCodes>(errorPayload);
  }
  return data;
}

async function regenerateUserSessionKey({ query }: { query: RegenerateSessionKeyQueryDto }) {
  const { data, error } = await api.post('/api/admin/regenerate-user-session-key', {
    params: {
      header: api.authHeader(),
      query,
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data) {
    throw new Error('Failed to regenerate session key for user');
  }
  if (!data?.success) {
    const errorPayload = data as unknown as ErrorResponse<RegenerateSessionKeyErrorCodes>;
    throw new ApiError<RegenerateSessionKeyErrorCodes>(errorPayload);
  }
  return true;
}

async function deleteAccountRequest({ query }: DeleteAccountVariables) {
  const { data, error } = await api.delete('/api/admin/delete-account', {
    params: {
      header: api.authHeader(),
      query,
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.success) {
    const errorPayload = data as unknown as ErrorResponse<DeleteAccountErrorCodes>;
    throw new ApiError<DeleteAccountErrorCodes>(errorPayload);
  }
  return true;
}

async function updateRolesRequest({ query, body }: UpdateRolesVariables) {
  const { data, error } = await api.patch('/api/admin/update-user-roles', {
    params: {
      header: api.authHeader(),
      query,
    },
    body,
  });
  if (error) {
    if (Array.isArray(error.message)) {
      throw new Error(error.message.join(', '));
    }
    throw new Error(getErrorMessage(error));
  }
  if (!data?.success) {
    const errorPayload = data as unknown as ErrorResponse<UpdateRolesErrorCodes>;
    throw new ApiError<UpdateRolesErrorCodes>(errorPayload);
  }
  return true;
}

async function resetPasswordRequest({ query, body }: ResetPasswordVariables) {
  const response = await api.post('/api/admin/reset-user-password', {
    params: {
      header: api.authHeader(),
      query,
    },
    body,
  });
  const { data, error } = response;
  if (error) {
    if (Array.isArray(error.message)) {
      throw new Error(error.message.join(', '));
    }
    throw new Error(getErrorMessage(error));
  }
  if (!data?.success) {
    const errorPayload = data as unknown as ErrorResponse<ResetPasswordErrorCodes>;
    throw new ApiError<ResetPasswordErrorCodes>(errorPayload);
  }
  return true;
}

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: fetchAccounts,
  });

  const invalidateAccounts = () => {
    queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
  };

  const createAccount = useMutation({
    mutationFn: createAccountRequest,
    onSuccess: invalidateAccounts,
  });

  const deleteAccount = useMutation({
    mutationFn: deleteAccountRequest,
    onSuccess: invalidateAccounts,
  });

  const regenerateSessionKey = useMutation({
    mutationFn: regenerateUserSessionKey,
    onSuccess: invalidateAccounts,
  });

  const updateRoles = useMutation({
    mutationFn: updateRolesRequest,
    onSuccess: invalidateAccounts,
  });

  const resetPassword = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: invalidateAccounts,
  });

  return {
    createAccount: createAccount.mutateAsync,
    deleteAccount: deleteAccount.mutateAsync,
    refetchAccounts: accountsQuery.refetch,
    regenerateSessionKey: regenerateSessionKey.mutateAsync,
    resetPassword: resetPassword.mutateAsync,
    updateRoles: updateRoles.mutateAsync,
    accounts: accountsQuery.data ?? [],
    isDeleting: deleteAccount.isPending,
    isLoadingAccounts: accountsQuery.isLoading,
    isRegeneratingSessionKey: regenerateSessionKey.isPending,
    isResettingPassword: resetPassword.isPending,
    isUpdatingRoles: updateRoles.isPending,
  };
}
