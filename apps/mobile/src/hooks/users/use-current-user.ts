import { useQuery } from '@tanstack/react-query';

import { useAuthedClient } from '@/lib/auth';
import { getCurrentUser } from '@/lib/api/users';

export function useCurrentUser(options?: { enabled?: boolean }) {
  useAuthedClient();
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: getCurrentUser,
    enabled: options?.enabled ?? true,
    retry: false,
  });
}
