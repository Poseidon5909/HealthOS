import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { parseErrorMessage } from '../utils/validation';

const shouldShowGlobalErrorToast = (error) => {
  if (!error) {
    return false;
  }

  if (error?.code === 'ERR_CANCELED') {
    return false;
  }

  return true;
};

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep most data fresh briefly, then revalidate in background.
      staleTime: 1000 * 60 * 2,

      // v5 cache lifecycle option (replaces cacheTime).
      gcTime: 1000 * 60 * 15,
      
      // Retry failed requests 3 times
      retry: 3,
      
      // Avoid aggressive foreground refetching unless a screen opts in.
      refetchOnWindowFocus: false,
      
      // Refetch on network reconnection
      refetchOnReconnect: true,
      
      // Don't refetch on component mount if data is fresh
      refetchOnMount: false,

      // Preserve structural sharing for stable memoized renders.
      structuralSharing: true,

      // Global fallback for unhandled query errors
      onError: (error) => {
        if (shouldShowGlobalErrorToast(error)) {
          toast.error(parseErrorMessage(error));
        }
      },
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,

      // Global fallback for unhandled mutation errors
      onError: (error) => {
        if (shouldShowGlobalErrorToast(error)) {
          toast.error(parseErrorMessage(error));
        }
      },
    },
  },
});

export default queryClient;
