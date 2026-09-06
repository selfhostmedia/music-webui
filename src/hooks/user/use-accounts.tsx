import { useMutation } from '@tanstack/react-query';
import api, { TypedApiError } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type UpdatePasswordEndpoint = paths['/api/user/update-password']['post'];

async function regenerateSessionKeyRequest() {
  const { data, error } = await api.post('/api/user/regenerate-session-key', {
    params: {
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(error);
  }
  if (!data?.success) {
    throw new Error('Failed to regenerate session key');
  }
  return data;
}

async function updatePasswordRequest(body: UpdatePasswordEndpoint['requestBody']['content']['application/json']) {
  const { data, error } = await api.post('/api/user/update-password', {
    params: {
      header: api.authHeader(),
    },
    body,
  });
  if (error) {
    throw new TypedApiError<UpdatePasswordEndpoint['responses']['400']['content']['application/json']['message']>(
      error.message,
      error.error,
    );
  }
  if (!data?.success) {
    throw new Error('Failed to update password');
  }
  return data;
}

export function useAccounts() {
  const regenerateSessionKey = useMutation({
    mutationFn: regenerateSessionKeyRequest,
  });

  const updatePassword = useMutation<
    UpdatePasswordEndpoint['responses']['200']['content']['application/json'],
    TypedApiError<UpdatePasswordEndpoint['responses']['400']['content']['application/json']['message'][number]>,
    UpdatePasswordEndpoint['requestBody']['content']['application/json']
  >({
    mutationFn: updatePasswordRequest,
  });

  return {
    regenerateSessionKey: regenerateSessionKey.mutateAsync,
    updatePassword: updatePassword.mutateAsync,
    isRegeneratingSessionKey: regenerateSessionKey.isPending,
    isUpdatingPassword: updatePassword.isPending,
  };
}
