import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { setupAuthInterceptor } from './api'

// Hook to automatically setup Clerk token injection for API calls
export const useSetupApiAuth = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Wait for Clerk to load and user to be signed in
        if (isLoaded && isSignedIn) {
          // Get token to verify it's available
          const token = await getToken();
          if (token) {
            setupAuthInterceptor(getToken);
            setAuthReady(true);
          }
        }
      } catch (err) {
        console.error('Error setting up auth:', err);
      }
    };
    
    setupAuth();
  }, [isLoaded, isSignedIn, getToken]);

  return authReady;
};
