import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30s
      gcTime: 1000 * 60 * 5, // 5m, v5 将 cacheTime 重命名为 gcTime
    },
    mutations: {
      retry: 0,
    },
  },
});
