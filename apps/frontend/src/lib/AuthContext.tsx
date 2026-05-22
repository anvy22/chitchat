"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient, setAccessToken } from "./api-client";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    
    // Check if we have an active session on initial load by trying to refresh the token
    const initAuth = async () => {
      // Don't try to auto-login on the callback page, let the callback page handle it
      if (pathname === '/auth/callback') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.post('/auth/refresh');
        if (isMounted && response.data.success) {
          const newAccessToken = response.data.data.accessToken;
          setAccessToken(newAccessToken);
          
          // Decode the JWT to get user info, or make a separate /me request
          // For now, we'll parse the JWT payload (base64)
          try {
            const payload = JSON.parse(atob(newAccessToken.split('.')[1]));
            setUser({
              id: payload.sub,
              email: payload.email,
              role: payload.role,
              workspaceId: payload.workspaceId
            });
          } catch (e) {
            console.error("Failed to parse JWT", e);
          }
        }
      } catch (error) {
        // Expected if there's no refresh cookie or it's expired
        console.log("No active session found");
        setAccessToken(null);
        setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Listen for unauthorized events from the API client interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      router.push('/sign-in');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [pathname, router]);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push('/sign-in');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
