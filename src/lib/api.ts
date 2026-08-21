import createClient from 'openapi-fetch';
import type { paths } from 'src/types/api-schema';

const authHeader = () => {
  const token = sessionStorage.getItem('jwt-token') || localStorage.getItem('jwt-token');
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: '' };
};

const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});

export default {
  authHeader,
  get: client.GET,
  post: client.POST,
  delete: client.DELETE,
  patch: client.PATCH,
  put: client.PUT,
};
