import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

// Hook to ensure auth is ready before making API calls
export const useAuthAPI = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for Clerk to load
        if (!isLoaded) return;

        // If user is not signed in, they shouldn't be here
        if (!isSignedIn) {
          setAuthError('Not signed in');
          return;
        }

        // Try to get token to verify auth is ready
        const token = await getToken();
        if (token) {
          setAuthReady(true);
          setAuthError(null);
        } else {
          setAuthError('Failed to get authentication token');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthError('Authentication error: ' + (err.message || 'Unknown error'));
      }
    };

    checkAuth();
  }, [isLoaded, isSignedIn, getToken]);

  return { authReady, authError };
};
