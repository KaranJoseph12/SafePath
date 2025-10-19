'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/services';

// Development mode - bypass authentication for testing
const DEVELOPMENT_MODE = true; // Set to false to re-enable authentication

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip authentication in development mode
        if (DEVELOPMENT_MODE) {
          console.log('🔓 Development mode: Authentication bypassed');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        if (!authService.isLoggedIn()) {
          router.push('/auth/login');
          return;
        }

        // Verify token by making a profile request
        await authService.getProfile();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="text-white mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return children;
}