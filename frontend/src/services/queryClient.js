import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      
      // Keep unused data in cache for 10 minutes
      cacheTime: 1000 * 60 * 10,
      
      // Retry failed requests 3 times
      retry: 3,
      
      // Refetch on window focus (user comes back to tab)
      refetchOnWindowFocus: true,
      
      // Refetch on network reconnection
      refetchOnReconnect: true,
      
      // Don't refetch on component mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});
