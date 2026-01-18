import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  HomeIcon,
  UsersIcon,
  PaintBrushIcon,
  BriefcaseIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowLeftIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Artists', href: '/admin/artists', icon: PaintBrushIcon },
  { name: 'Commissions', href: '/admin/commissions', icon: BriefcaseIcon },
  { name: 'Payments', href: '/admin/payments', icon: CreditCardIcon },
  { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-morning-light">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-morning-darker/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-morning-darker transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-morning-dark/30">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-semibold text-white">Admin Panel</span>
              <p className="text-xs text-morning-gray">Management Console</p>
            </div>
          </div>

          {/* Back to User Dashboard */}
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 mx-4 mt-4 px-4 py-2 rounded-lg text-morning-gray hover:bg-morning-dark/50 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </NavLink>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {adminNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-morning-gray hover:bg-morning-dark/50 hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-morning-dark/30">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-morning-dark/50">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-xs text-morning-gray truncate">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-morning-muted">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-morning-soft"
            >
              <Bars3Icon className="w-6 h-6 text-morning-dark" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-morning-darker">Administration</h1>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <span className="badge-primary">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
