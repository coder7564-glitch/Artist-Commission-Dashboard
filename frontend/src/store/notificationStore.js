import { create } from 'zustand'
import { notificationsAPI } from '../services/api'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true })
    try {
      const response = await notificationsAPI.getNotifications()
      set({
        notifications: response.data.results || response.data,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsAPI.getUnreadCount()
      set({ unreadCount: response.data.unread_count })
    } catch (error) {
      console.error('Failed to fetch unread count')
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    } catch (error) {
      console.error('Failed to mark notification as read')
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllAsRead()
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }))
    } catch (error) {
      console.error('Failed to mark all notifications as read')
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationsAPI.deleteNotification(id)
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    } catch (error) {
      console.error('Failed to delete notification')
    }
  },
}))
