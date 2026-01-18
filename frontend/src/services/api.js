import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: (data) => api.post('/users/register/', data),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
}

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  changePassword: (data) => api.post('/users/password/change/', data),
  getUsers: (params) => api.get('/users/', { params }),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  getDashboardStats: () => api.get('/users/dashboard/stats/'),
}

// Artists API
export const artistsAPI = {
  getArtists: (params) => api.get('/artists/', { params }),
  getArtist: (id) => api.get(`/artists/${id}/`),
  createArtist: (data) => api.post('/artists/create/', data),
  updateArtist: (data) => api.patch('/artists/me/', data),
  getPortfolio: () => api.get('/artists/portfolio/'),
  addPortfolioItem: (data) => api.post('/artists/portfolio/', data),
  updatePortfolioItem: (id, data) => api.patch(`/artists/portfolio/${id}/`, data),
  deletePortfolioItem: (id) => api.delete(`/artists/portfolio/${id}/`),
  // Admin
  getAdminArtists: (params) => api.get('/artists/admin/list/', { params }),
  updateArtistStatus: (id, status) => api.patch(`/artists/admin/${id}/`, { status }),
}

// Commissions API
export const commissionsAPI = {
  getCommissions: (params) => api.get('/commissions/', { params }),
  getCommission: (id) => api.get(`/commissions/${id}/`),
  createCommission: (data) => api.post('/commissions/create/', data),
  updateCommission: (id, data) => api.patch(`/commissions/${id}/update/`, data),
  updateStatus: (id, status) => api.post(`/commissions/${id}/status/`, { status }),
  addReview: (id, data) => api.post(`/commissions/${id}/review/`, data),
  getStats: () => api.get('/commissions/stats/'),
  // Categories
  getCategories: () => api.get('/commissions/categories/'),
  // Revisions
  addRevision: (commissionId, data) => api.post(`/commissions/${commissionId}/revisions/`, data),
  // Admin
  getAdminCommissions: (params) => api.get('/commissions/admin/list/', { params }),
}

// Payments API
export const paymentsAPI = {
  getPayments: (params) => api.get('/payments/', { params }),
  getPayment: (id) => api.get(`/payments/${id}/`),
  createPayment: (data) => api.post('/payments/create/', data),
  processPayment: (id) => api.post(`/payments/${id}/process/`),
  getStats: () => api.get('/payments/stats/'),
  // Payment Methods
  getPaymentMethods: () => api.get('/payments/methods/'),
  addPaymentMethod: (data) => api.post('/payments/methods/', data),
  deletePaymentMethod: (id) => api.delete(`/payments/methods/${id}/`),
  // Admin
  getAdminPayments: (params) => api.get('/payments/admin/list/', { params }),
  getAdminStats: () => api.get('/payments/admin/stats/'),
}

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications/'),
  getUnreadCount: () => api.get('/notifications/unread-count/'),
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/notifications/mark-all-read/'),
  deleteNotification: (id) => api.delete(`/notifications/${id}/`),
}

export default api
