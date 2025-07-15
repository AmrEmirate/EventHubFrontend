"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// [PERUBAHAN] Impor fungsi login dari apihelper
import { getMyProfile, login as apiLogin, UserProfile } from '@/lib/apihelper'; 

// Definisikan tipe untuk context
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>; // <-- Diubah untuk menerima kredensial
  logout: () => void;
  loading: boolean;
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat provider komponen
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Efek ini untuk memeriksa sesi yang sudah ada saat aplikasi dimuat
  useEffect(() => {
    const checkUserSession = async () => {
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
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // [PERUBAHAN UTAMA] Fungsi login sekarang menangani seluruh proses
  const login = async (credentials: any) => {
    setLoading(true);
    try {
      // Panggil fungsi login dari apihelper
      const response = await apiLogin(credentials);
      const { token, user: userData } = response.data;

      // 1. Simpan token ke localStorage
      localStorage.setItem('authToken', token);
      
      // 2. Langsung set data user dari respons API
      setUser(userData);
      
      // 3. Arahkan pengguna ke halaman utama atau profil
      router.push('/'); 
    } catch (error) {
      console.error("Proses login gagal:", error);
      // Lemparkan kembali error agar bisa ditampilkan di form login
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani proses logout
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
    loading 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan context di komponen lain
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}