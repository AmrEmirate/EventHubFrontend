import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1'; // Ganti dengan URL backend Anda

// Utility function to handle API requests
const apiRequest = async (method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any) => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        // Include authorization token if necessary
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is saved in localStorage
      },
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error; // Rethrow error for handling at the call site
  }
};

// API calls for Events

// Fetch all events
export const getEvents = async () => {
  return await apiRequest('get', '/events');
};

// Create a new event
export const createEvent = async (eventData: any) => {
  return await apiRequest('post', '/events', eventData);
};

// Update an event
export const updateEvent = async (eventId: string, eventData: any) => {
  return await apiRequest('put', `/events/${eventId}`, eventData);
};

// Delete an event
export const deleteEvent = async (eventId: string) => {
  return await apiRequest('delete', `/events/${eventId}`);
};

// API calls for Transactions

// Fetch all transactions
export const getTransactions = async () => {
  return await apiRequest('get', '/transactions');
};

// Approve a transaction
export const approveTransaction = async (transactionId: string) => {
  return await apiRequest('post', `/transactions/${transactionId}/approve`);
};

// Reject a transaction
export const rejectTransaction = async (transactionId: string) => {
  return await apiRequest('post', `/transactions/${transactionId}/reject`);
};

// Upload payment proof for a transaction
export const uploadPaymentProof = async (transactionId: string, proofData: FormData) => {
  return await apiRequest('post', `/transactions/${transactionId}/upload`, proofData);
};

// Apply promo code (validation)
export const applyPromoCode = async (promoCode: string) => {
  return await apiRequest('post', '/promos/verify', { promoCode });
};

// Use points for transaction
export const usePointsForTransaction = async (transactionId: string, points: number) => {
  return await apiRequest('post', `/transactions/${transactionId}/use-points`, { points });
};

// API calls for Users (Optional: if needed for authentication)
export const login = async (email: string, password: string) => {
  return await apiRequest('post', '/auth/login', { email, password });
};

export const register = async (userData: any) => {
  return await apiRequest('post', '/auth/register', userData);
};

