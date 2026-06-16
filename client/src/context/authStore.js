/**
 * Auth Store - Zustand
 * Global authentication state management
 */

import { create } from 'zustand';
import { apiService } from '../services/api';

export const useAuthStore = create((set) => ({
  // State
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },

  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
    set({ accessToken: token, isAuthenticated: !!token });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.register({ name, email, password });
      const { user, accessToken } = response.data.data;

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.login(email, password);
      const { user, accessToken } = response.data.data;

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await apiService.getMe();
      const { user } = response.data.data;

      set({ user, isLoading: false });
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      throw error;
    }
  },

  hasRole: (role) => {
    const state = useAuthStore.getState();
    return state.user?.role === role;
  },

  hasAnyRole: (roles) => {
    const state = useAuthStore.getState();
    return roles.includes(state.user?.role);
  },

  isAdmin: () => {
    const state = useAuthStore.getState();
    return ['SUPER_ADMIN', 'ADMIN'].includes(state.user?.role);
  },

  isScorer: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'SCORER';
  },

  isSuperAdmin: () => {
    const state = useAuthStore.getState();
    return state.user?.role === 'SUPER_ADMIN';
  },
}));
