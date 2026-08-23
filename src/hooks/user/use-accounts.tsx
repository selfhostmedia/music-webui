import { useMutation } from '@tanstack/react-query';
import api, { ApiError, type ErrorResponse, type GenericErrorCodes, getErrorMessage } from '@/lib/api';
import type { paths } from '@/types/api-schema';

type UpdateEndpoint = paths['/api/user/update-password']['post'];

export type UpdatePasswordBodyDto = UpdateEndpoint['requestBody']['content']['application/json'];
export type UpdatePasswordErrorCodes =
  GenericErrorCodes | UpdateEndpoint['responses']['400']['content']['application/json']['message'][number];

type UpdatePasswordVariables = {
  body: UpdatePasswordBodyDto;
};

async function regenerateSessionKeyRequest() {
  const { data, error } = await api.post('/api/user/regenerate-session-key', {
    params: {
      header: api.authHeader(),
    },
  });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
  if (!data?.success) {
    const errorPayload = data as unknown as ErrorResponse<GenericErrorCodes>;
    throw new ApiError<GenericErrorCodes>(errorPayload);
  }
  return true;
}

async function updatePasswordRequest({ body }: UpdatePasswordVariables) {
  const response = await api.post('/api/user/update-password', {
    params: {
      header: api.authHeader(),
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
    const errorPayload = data as unknown as ErrorResponse<UpdatePasswordErrorCodes>;
    throw new ApiError<UpdatePasswordErrorCodes>(errorPayload);
  }
  return true;
}

export function useAccounts() {
  const regenerateSessionKey = useMutation({
    mutationFn: regenerateSessionKeyRequest,
  });

  const updatePassword = useMutation({
    mutationFn: updatePasswordRequest,
  });

  return {
    regenerateSessionKey: regenerateSessionKey.mutateAsync,
    updatePassword: updatePassword.mutateAsync,
    isRegeneratingSessionKey: regenerateSessionKey.isPending,
    isUpdatingPassword: updatePassword.isPending,
  };
}
