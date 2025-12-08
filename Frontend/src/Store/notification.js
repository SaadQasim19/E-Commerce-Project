import { create } from 'zustand';
import { API_ENDPOINTS } from '../config/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },

  // Fetch all notifications
  fetchNotifications: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_ENDPOINTS.NOTIFICATIONS}?page=${page}&limit=20`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      set({
        notifications: data.notifications,
        unreadCount: data.unreadCount,
        pagination: data.pagination,
        loading: false,
      });

      return { success: true, data };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  // Fetch unread count only
  fetchUnreadCount: async () => {
    try {
      const res = await fetch(API_ENDPOINTS.UNREAD_COUNT, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch unread count');
      }

      set({ unreadCount: data.unreadCount });

      return { success: true, unreadCount: data.unreadCount };
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { success: false, message: error.message };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const res = await fetch(API_ENDPOINTS.MARK_AS_READ(notificationId), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to mark as read');
      }

      // Update local state
      const { notifications, unreadCount } = get();
      const updatedNotifications = notifications.map((notif) =>
        notif._id === notificationId ? { ...notif, isRead: true } : notif
      );

      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - 1),
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, message: error.message };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const res = await fetch(API_ENDPOINTS.MARK_ALL_READ, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to mark all as read');
      }

      // Update local state
      const { notifications } = get();
      const updatedNotifications = notifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const res = await fetch(API_ENDPOINTS.DELETE_NOTIFICATION(notificationId), {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete notification');
      }

      // Update local state
      const { notifications, unreadCount } = get();
      const deletedNotif = notifications.find((n) => n._id === notificationId);
      const newUnreadCount = deletedNotif && !deletedNotif.isRead ? unreadCount - 1 : unreadCount;

      set({
        notifications: notifications.filter((notif) => notif._id !== notificationId),
        unreadCount: Math.max(0, newUnreadCount),
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, message: error.message };
    }
  },

  // Clear all read notifications
  clearReadNotifications: async () => {
    try {
      const res = await fetch(API_ENDPOINTS.CLEAR_READ, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to clear read notifications');
      }

      // Update local state - keep only unread notifications
      const { notifications } = get();
      set({
        notifications: notifications.filter((notif) => !notif.isRead),
      });

      return { success: true };
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      return { success: false, message: error.message };
    }
  },

  // Reset notifications (on logout)
  resetNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    });
  },
}));

export default useNotificationStore;
