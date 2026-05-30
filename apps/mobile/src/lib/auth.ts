import { useAuth } from '@clerk/expo';

import { apiClient } from '@/lib/axios';

export function useAuthedClient() {
  const { getToken } = useAuth();

  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return apiClient;
}
