import { useEffect, useState } from 'react'
import { usersAPI, paymentsAPI } from '../../services/api'
import { Card, CardTitle, StatsCard } from '../../components/ui'
import { UsersIcon, CurrencyDollarIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function AdminReports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStats, paymentStats] = await Promise.all([
          usersAPI.getDashboardStats(),
          paymentsAPI.getAdminStats(),
        ])
        setStats({ ...userStats.data, ...paymentStats.data })
      } catch (error) {
        console.error('Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue ($)',
      data: [2400, 3200, 4100, 3800, 5200, 4800, 5600, 6100, 5800, 6400, 7200, stats?.monthly_revenue || 0],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Clients',
      data: [45, 62, 78, 95, 110, stats?.new_clients_monthly || 0],
      backgroundColor: '#10b981',
    }]
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Reports & Analytics</h1>
        <p className="text-morning-gray">Platform performance insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Clients" value={stats?.total_clients || 0} icon={UsersIcon} color="primary" />
        <StatsCard title="Total Revenue" value={`$${stats?.total_revenue || 0}`} icon={CurrencyDollarIcon} color="success" />
        <StatsCard title="Commissions" value={stats?.total_commissions || 0} icon={ChartBarIcon} color="warning" />
        <StatsCard title="New Clients (30d)" value={stats?.new_clients_monthly || 0} icon={ArrowTrendingUpIcon} color="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Revenue Trend</CardTitle>
          <div className="mt-4 h-72"><Line data={revenueData} options={{ maintainAspectRatio: false }} /></div>
        </Card>
        <Card>
          <CardTitle>Client Growth</CardTitle>
          <div className="mt-4 h-72"><Bar data={userGrowthData} options={{ maintainAspectRatio: false }} /></div>
        </Card>
      </div>
    </div>
  )
}
