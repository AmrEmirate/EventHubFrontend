import axios from 'axios';

// --- Definisi Tipe Data (Interface) ---

interface SimpleMessageResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  referralCode: string | null;
  phone: string | null;
  profile: {
    bio: string | null;
    avatarUrl: string | null;
  } | null;
  role: 'CUSTOMER' | 'ORGANIZER';
}

interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  isFree: boolean;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  ticketTotal: number;
  ticketSold: number;
  imageUrl?: string | null;
}

// Tipe untuk data ulasan
export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
    profile: {
      avatarUrl: string | null;
    } | null;
  };
}

// Tipe Event yang menyertakan data ulasan
export interface EventWithReviews extends Event {
  reviews: Review[];
}

export interface Voucher {
  id: string;
  code: string;
  discountPercent: number;
  expiresAt: string;
  maxDiscount?: number | null;
  event?: {
    name: string;
  } | null;
}

export interface Transaction {
  id: string;
  status: 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'REJECTED' | 'PENDING_CONFIRMATION';
  totalPrice: number;
  finalPrice: number;
  createdAt: string;
  paymentDeadline: string;
  paymentProofUrl?: string | null;
  event: {
    id: string;
    name: string;
    slug: string;
    startDate: string;
    endDate: string; // Pastikan endDate ada di sini
    location?: string;
  };
  user: {
      name: string;
      email: string;
  }
}

export interface OrganizerDashboardData {
  stats: {
    revenue: number;
    ticketsSold: number;
    totalEvents: number;
  };
  analytics: {
    revenuePerDay: { date: string; total: number }[];
    ticketsPerEvent: { eventName: string; sold: number }[];
  };
}

export interface OrganizerTransaction extends Transaction {
  user: {
    name: string;
    email: string;
  };
}

export interface Attendee {
  user: {
    name: string;
    email: string;
  };
  quantity: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// --- Konfigurasi Instance Axios ---
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
        config.headers = {};
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Kumpulan Fungsi API ---

// Auth
export const login = (data: any) => api.post<LoginResponse>('/auth/login', data);
export const register = (data: any) => api.post<SimpleMessageResponse>('/auth/register', data);
export const verifyEmail = (token: string) => api.get<SimpleMessageResponse>(`/auth/verify-email?token=${token}`);
export const forgotPassword = (email: string) => api.post<SimpleMessageResponse>('/auth/forgot-password', { email });
export const resetPassword = (data: { token: string; newPassword: string }) => api.post<SimpleMessageResponse>('/auth/reset-password', data);

// User Profile
export const getMyProfile = () => api.get<UserProfile>('/users/me');
export const updateMyProfile = (data: { name?: string; bio?: string; phone?: string }) =>
  api.put<{ message: string, data: UserProfile }>('/users/me', data);
export const changePassword = (data: any) => api.put<SimpleMessageResponse>('/users/me/change-password', data);
export const updateMyAvatar = (avatarData: FormData) => {
  return api.put('/users/me/avatar', avatarData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Events
export const getEvents = (params?: any) => api.get<Event[]>('/events', { params });
export const getEventBySlug = (slug: string) => api.get<EventWithReviews>(`/events/${slug}`);
export const getEventById = (id: string) => api.get<Event>(`/events/id/${id}`);
export const getMyOrganizerEvents = () => api.get<Event[]>('/events/organizer/my-events');
export const createEvent = (data: FormData) => api.post('/events', data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const updateEvent = (eventId: string, data: FormData) => api.put(`/events/${eventId}`, data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const deleteEvent = (eventId: string) => api.delete(`/events/${eventId}`);

// Vouchers
export const getMyVouchers = () => api.get<Voucher[]>('/vouchers/me');
export const createOrganizerVoucher = (data: any) => api.post('/vouchers/organizer', data);

// Transactions
export const getMyTransactions = () => api.get<Transaction[]>('/transactions/me');
export const createTransaction = (data: { eventId: string; quantity: number; voucherCode?: string; usePoints?: boolean }) => api.post('/transactions', data);
export const getTransactionById = (transactionId: string) => api.get<Transaction>(`/transactions/${transactionId}`);

// Reviews
export const createReview = (data: { eventId: string; rating: number; comment?: string }) => api.post('/reviews', data);

// Notifications
export const getMyNotifications = () => api.get<Notification[]>('/notifications/me');
export const markNotificationsAsRead = () => api.post('/notifications/me/mark-as-read');

// --- Fungsi untuk Organizer ---
export const getOrganizerTransactions = () => api.get<OrganizerTransaction[]>('/transactions/organizer');
export const approveTransaction = (transactionId: string) => api.post(`/transactions/organizer/${transactionId}/approve`);
export const rejectTransaction = (transactionId: string) => api.post(`/transactions/organizer/${transactionId}/reject`);
export const getEventAttendees = (eventId: string) => api.get<Attendee[]>(`/events/${eventId}/attendees`);

// Dashboard
export const getOrganizerDashboard = () => api.get<OrganizerDashboardData>('/dashboard');

// File Upload
export const uploadPaymentProof = (transactionId: string, proofData: FormData) => {
  return api.post(`/transactions/${transactionId}/upload`, proofData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
