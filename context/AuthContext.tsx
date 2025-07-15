// frontend/context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, UserProfile } from '@/lib/apihelper'; // Pastikan path ini benar

// Definisikan tipe untuk context
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Buat context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat provider komponen
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Loading state untuk memeriksa sesi awal
  const router = useRouter();

  // Efek ini berjalan sekali saat aplikasi pertama kali dimuat
  // untuk memeriksa apakah ada sesi login yang tersimpan
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Jika ada token, coba ambil data profil
          const response = await getMyProfile();
          setUser(response.data);
        } catch (error) {
          // Jika token tidak valid, hapus token dan logout
          console.error("Sesi tidak valid, logout paksa.", error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  // Fungsi untuk menangani proses login
  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    // Setelah token disimpan, ambil data profil untuk memperbarui state
    const fetchProfileOnLogin = async () => {
        setLoading(true);
        try {
            const response = await getMyProfile();
            setUser(response.data);
            router.push('/profile'); // Arahkan ke profil setelah login berhasil
        } catch(error) {
            console.error("Gagal mengambil profil setelah login", error);
            setLoading(false);
        }
    }
    fetchProfileOnLogin();
  };

  // Fungsi untuk menangani proses logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/auth/login');
  };

  const value = { 
    user, 
    isAuthenticated: !!user, // isAuthenticated akan true jika user tidak null
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