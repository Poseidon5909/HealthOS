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

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,

      gcTime: 1000 * 60 * 15,
      
      retry: 3,
      
      refetchOnWindowFocus: false,
      
      refetchOnReconnect: true,
      
      refetchOnMount: false,

      structuralSharing: true,

      onError: (error) => {
        if (shouldShowGlobalErrorToast(error)) {
          toast.error(parseErrorMessage(error));
        }
      },
    },
    mutations: {
      retry: 1,

      onError: (error) => {
        if (shouldShowGlobalErrorToast(error)) {
          toast.error(parseErrorMessage(error));
        }
      },
    },
  },
});

export default queryClient;
