import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'

// Landing Page
import Landing from './pages/Landing'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Dashboard Pages
import UserDashboard from './pages/user/Dashboard'
import UserCommissions from './pages/user/Commissions'
import UserCommissionDetail from './pages/user/CommissionDetail'
import NewCommission from './pages/user/NewCommission'
import UserProfile from './pages/user/Profile'
import Artists from './pages/user/Artists'
import ArtistDetail from './pages/user/ArtistDetail'

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminArtists from './pages/admin/Artists'
import AdminCommissions from './pages/admin/Commissions'
import AdminPayments from './pages/admin/Payments'
import AdminReports from './pages/admin/Reports'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* User Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/commissions" element={<UserCommissions />} />
        <Route path="/commissions/new" element={<NewCommission />} />
        <Route path="/commissions/:id" element={<UserCommissionDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/admin/commissions" element={<AdminCommissions />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
