import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { UserRoleEnum, components } from '@/types/api-schema';

type AccountDto = components['schemas']['AdminAccountDto'];
type CreateAccountBodyDto = components['schemas']['AdminCreateAccountBodyDto'];

const ACCOUNTS_QUERY_KEY = ['accounts'];

async function fetchAccounts(): Promise<AccountDto[]> {
  const response = await api.get('/api/admin/list-accounts', {
    params: { header: api.authHeader() },
  });

  if (!response.data?.accounts) throw new Error('No accounts data received');
  return response.data.accounts;
}

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: fetchAccounts,
  });

  const invalidateAccounts = async () => {
    await queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
  };

  const createAccount = useMutation({
    mutationFn: async (body: CreateAccountBodyDto) => {
      const { data, error } = await api.post('/api/admin/create-account', {
        params: {
          header: api.authHeader(),
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
        throw new Error('Failed to create account');
      }
      return true;
    },
    onSuccess: invalidateAccounts,
    // eslint-disable-next-line no-console
    onError: (error) => console.error('Failed to create account:', error),
  });

  const regenerateSessionKey = useMutation({
    mutationFn: async (accountId: number) => {
      const { data, error } = await api.post('/api/admin/regenerate-user-session-key', {
        params: {
          header: api.authHeader(),
          query: { accountId },
        },
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to regenerate session key');
      }
      return true;
    },
    onSuccess: invalidateAccounts,
    // eslint-disable-next-line no-console
    onError: (error) => console.error('Failed to regenerate session key:', error),
  });

  const updateRoles = useMutation({
    mutationFn: async (vars: { accountId: number; roles: UserRoleEnum[] }) => {
      const { data, error } = await api.patch('/api/admin/update-user-roles', {
        params: {
          header: api.authHeader(),
          query: { accountId: vars.accountId },
        },
        body: { roles: vars.roles },
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to update roles');
      }
      return true;
    },
    onSuccess: invalidateAccounts,
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error('[use-accounts] Failed to update roles:', error);
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (vars: { accountId: number; newPassword: string }) => {
      const response = await api.post('/api/admin/reset-user-password', {
        params: {
          header: api.authHeader(),
          query: { id: vars.accountId },
        },
        body: { newPassword: vars.newPassword },
      });
      const { data, error } = response;
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to reset password');
      }
      return true;
    },
    onSuccess: invalidateAccounts,
    // eslint-disable-next-line no-console
    onError: (error) => console.error('Failed to reset password:', error),
  });

  const deleteAccount = useMutation({
    mutationFn: async (accountId: number) => {
      const { data, error } = await api.delete('/api/admin/delete-account', {
        params: {
          header: api.authHeader(),
          query: { id: accountId },
        },
      });
      if (error) {
        if (Array.isArray(error.message)) {
          throw new Error(error.message.join(', '));
        }
        throw new Error(error.message);
      }
      if (!data?.success) {
        throw new Error('Failed to delete account');
      }
      return true;
    },
    onSuccess: invalidateAccounts,
    // eslint-disable-next-line no-console
    onError: (error) => console.error('Failed to delete account:', error),
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
    isLoading: accountsQuery.isLoading,
    isRegenerating: regenerateSessionKey.isPending,
    isResettingPassword: resetPassword.isPending,
    isUpdatingRoles: updateRoles.isPending,
  };
}
