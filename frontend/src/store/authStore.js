import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI, usersAPI } from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authAPI.login({ email, password })
          const { access, refresh } = response.data
          
          localStorage.setItem('access_token', access)
          localStorage.setItem('refresh_token', refresh)
          
          // Fetch user profile
          const profileResponse = await usersAPI.getProfile()
          
          set({
            user: profileResponse.data,
            isAuthenticated: true,
            isLoading: false,
          })
          
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.detail || 'Login failed',
            isLoading: false,
          })
          return { success: false, error: error.response?.data?.detail }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          await authAPI.register(userData)
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data || 'Registration failed',
            isLoading: false,
          })
          return { success: false, error: error.response?.data }
        }
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } })
      },

      fetchUser: async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
          set({ isAuthenticated: false, user: null })
          return
        }
        
        try {
          const response = await usersAPI.getProfile()
          set({
            user: response.data,
            isAuthenticated: true,
          })
        } catch (error) {
          set({ isAuthenticated: false, user: null })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
