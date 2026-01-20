import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { commissionsAPI, paymentsAPI } from '../../services/api'
import { Card, CardTitle, StatsCard, StatusBadge } from '../../components/ui'
import {
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function UserDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [recentCommissions, setRecentCommissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, commissionsRes] = await Promise.all([
          commissionsAPI.getStats(),
          commissionsAPI.getCommissions({ page_size: 5 }),
        ])
        setStats(statsRes.data)
        setRecentCommissions(commissionsRes.data.results || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header with Character */}
      {user?.role === 'client' ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-violet-50 to-purple-50 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name || user?.username}!
              </h1>
              <p className="text-gray-600 mt-2 max-w-md">
                Manage your commissions and connect with talented artists. Track your orders from request to delivery.
              </p>
              <Link
                to="/commissions/new"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
              >
                <PlusIcon className="w-5 h-5" />
                New Commission
              </Link>
            </div>
            <div className="hidden lg:block">
              <img
                src="/characters/Client Managing Orders Projects.png"
                alt="Client managing orders"
                className="w-48 h-48 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-200/30 rounded-full blur-3xl"></div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-morning-darker">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-morning-gray mt-1">
              Here's what's happening with your commissions
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Commissions"
          value={stats?.total || 0}
          icon={BriefcaseIcon}
          color="primary"
        />
        <StatsCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={ClockIcon}
          color="warning"
        />
        <StatsCard
          title="Delivered"
          value={stats?.delivered || 0}
          icon={CheckCircleIcon}
          color="success"
        />
        <StatsCard
          title={user?.role === 'artist' ? 'Total Earnings' : 'Total Spent'}
          value={`$${user?.role === 'artist' ? (stats?.total_earned || 0) : (stats?.total_spent || 0)}`}
          icon={CurrencyDollarIcon}
          color="info"
        />
      </div>

      {/* Earnings Overview - Artists Only */}
      {user?.role === 'artist' && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-morning-darker">Earnings Overview</h3>
              <p className="text-sm text-primary-500">Last 7 months performance</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm font-semibold text-emerald-600">+18.2%</span>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-3">
            {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((month, index) => {
              const heights = [55, 50, 60, 65, 75, 70, 100]
              const isCurrentMonth = index === 6
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-xl transition-all ${isCurrentMonth
                      ? 'bg-gradient-to-t from-purple-500 to-violet-400'
                      : 'bg-gradient-to-t from-gray-200 to-gray-100'
                      }`}
                    style={{ height: `${heights[index]}%` }}
                  />
                  <span className="text-xs text-morning-gray">{month}</span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Recent Commissions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Recent Commissions</CardTitle>
          <Link to="/commissions" className="text-sm text-primary-500 hover:text-primary-600">
            View all
          </Link>
        </div>

        {recentCommissions.length === 0 ? (
          <div className="text-center py-8">
            <BriefcaseIcon className="w-12 h-12 text-morning-muted mx-auto mb-3" />
            <p className="text-morning-gray">No commissions yet</p>
            {user?.role === 'client' && (
              <Link to="/commissions/new" className="text-primary-500 hover:text-primary-600 text-sm mt-2 inline-block">
                Create your first commission
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recentCommissions.map((commission) => (
              <Link
                key={commission.id}
                to={`/commissions/${commission.id}`}
                className="flex items-center justify-between p-4 rounded-lg bg-morning-soft hover:bg-morning-muted transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-morning-darker truncate">
                    {commission.title}
                  </p>
                  <p className="text-sm text-morning-gray">
                    Artist: {commission.artist_name}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <StatusBadge status={commission.status} />
                  {commission.final_price && (
                    <span className="text-sm font-medium text-morning-dark">
                      ${commission.final_price}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover className="cursor-pointer" onClick={() => window.location.href = '/artists'}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-morning-darker">Browse Artists</h3>
              <p className="text-sm text-morning-gray">Find talented artists for your project</p>
            </div>
          </div>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => window.location.href = '/profile'}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-morning-darker">Update Profile</h3>
              <p className="text-sm text-morning-gray">Manage your account settings</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
