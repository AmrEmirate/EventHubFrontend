"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, login as apiLogin, UserProfile } from '@/lib/apihelper'; 

// Definisikan tipe untuk context
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>; // <-- Tambahkan ini
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fungsi yang bisa dipanggil untuk me-refresh data user
  const fetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await getMyProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Sesi tidak valid, token dihapus.", error);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      await fetchUser();
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await apiLogin(credentials);
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      router.push('/'); 
    } catch (error) {
      console.error("Proses login gagal:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/auth/login');
  };

  const value = { 
    user, 
    isAuthenticated: !!user,
    login, 
    logout, 
    loading,
    fetchUser // <-- Ekspos fungsi ini ke context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}