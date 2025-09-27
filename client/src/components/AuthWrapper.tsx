'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthWrapper({ 
  children, 
  requireAdmin = true 
}: { 
  children: React.ReactNode; 
  requireAdmin?: boolean 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Verify token with backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/verify/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (requireAdmin && !userData.isAdmin) {
          router.push('/unauthorized');
          return;
        }

        // If we get here, auth is valid
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear any invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        // Redirect to login with a return URL
        const currentPath = window.location.pathname;
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
      }
    };

    checkAuth();
  }, [router, requireAdmin]);

  // Don't render anything during server-side rendering or while loading
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
