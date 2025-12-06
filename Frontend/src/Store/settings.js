import { create } from 'zustand';
import { API_ENDPOINTS } from '../config/api';

const useSettingsStore = create((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  // Fetch all settings
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Update store information
  updateStoreInfo: async (storeInfo) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}/store-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(storeInfo),
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating store info:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Update general settings
  updateGeneralSettings: async (generalSettings) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}/general`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(generalSettings),
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating general settings:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Update payment settings
  updatePaymentSettings: async (paymentSettings) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentSettings),
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating payment settings:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Update shipping settings
  updateShippingSettings: async (shippingSettings) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(shippingSettings),
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error updating shipping settings:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },

  // Reset settings to default
  resetSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_ENDPOINTS.SETTINGS}/reset`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        set({ settings: data.settings, loading: false });
        return { success: true, message: data.message };
      } else {
        set({ error: data.message, loading: false });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      set({ error: error.message, loading: false });
      return { success: false, message: error.message };
    }
  },
}));

export default useSettingsStore;
