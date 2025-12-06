import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_ENDPOINTS } from '../config/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Signup
      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(API_ENDPOINTS.SIGNUP, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify(userData),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Signup failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify(credentials),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = get().token;
          
          await fetch(API_ENDPOINTS.LOGOUT, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return { success: true, message: 'Logged out successfully' };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Get current user (check if still authenticated)
      checkAuth: async () => {
        const token = get().token;
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const res = await fetch(API_ENDPOINTS.ME, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Authentication check failed');
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message,
          });
        }
      },

      // Update profile
      updateProfile: async (profileData) => {
        const token = get().token;
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(profileData),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Profile update failed');
          }

          set({
            user: data.user,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Update password
      updatePassword: async (passwordData) => {
        const token = get().token;
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(passwordData),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Password update failed');
          }

          set({
            user: data.user,
            token: data.token, // New token after password change
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Request failed');
          }

          set({ isLoading: false, error: null });
          return { success: true, message: data.message, resetToken: data.resetToken };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Reset password
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(API_ENDPOINTS.RESET_PASSWORD(token), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ newPassword }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Password reset failed');
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set token (for OAuth callback)
      setToken: (token) => set({ token, isAuthenticated: !!token }),

      // Set user (for OAuth callback)
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // Delete account
      deleteAccount: async (password) => {
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(API_ENDPOINTS.DELETE_ACCOUNT, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ password }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || 'Account deletion failed');
          }

          // Clear all auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return { success: true, message: data.message };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key name
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
    }
  )
);

export default useAuthStore;
