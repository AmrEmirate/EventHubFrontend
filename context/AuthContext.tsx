"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile, login as apiLogin, UserProfile, getMyNotifications, Notification } from '@/lib/apihelper'; 

// Definisikan tipe untuk context
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  fetchUser: () => Promise<void>;
  // [BARU] Tambahkan state dan fungsi untuk notifikasi
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // [BARU] State untuk notifikasi
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

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
  
  // [BARU] Fungsi untuk mengambil notifikasi
  const fetchNotifications = async () => {
      if (!localStorage.getItem('authToken')) return;
      try {
          const res = await getMyNotifications();
          setNotifications(res.data);
      } catch (error) {
          console.error("Gagal mengambil notifikasi:", error);
      }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      await fetchUser();
      await fetchNotifications(); // Ambil notifikasi saat user pertama kali login
      setLoading(false);
    };

    checkUserSession();

    // Set interval untuk memeriksa notifikasi baru setiap 1 menit
    const interval = setInterval(() => {
        fetchNotifications();
    }, 60000); // 60 detik

    return () => clearInterval(interval); // Hapus interval saat komponen di-unmount

  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const response = await apiLogin(credentials);
      const { token, user: userData } = response.data;
      localStorage.setItem('authToken', token);
      setUser(userData);
      await fetchNotifications(); // Ambil notifikasi setelah login berhasil
      router.push('/'); 
    } catch (error) {
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setNotifications([]); // Kosongkan notifikasi saat logout
    router.push('/auth/login');
  };

  const value = { 
    user, 
    isAuthenticated: !!user,
    login, 
    logout, 
    loading,
    fetchUser,
    notifications, // <-- Ekspos state notifikasi
    fetchNotifications, // <-- Ekspos fungsi fetch notifikasi
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