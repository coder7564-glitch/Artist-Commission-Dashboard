import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usersAPI, paymentsAPI } from '../../services/api'
import { Card, CardTitle, StatsCard } from '../../components/ui'
import { UsersIcon, PaintBrushIcon, BriefcaseIcon, CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [paymentStats, setPaymentStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, paymentRes] = await Promise.all([
          usersAPI.getDashboardStats(),
          paymentsAPI.getAdminStats(),
        ])
        setStats(statsRes.data)
        setPaymentStats(paymentRes.data)
      } catch (error) {
        console.error('Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
  }

  const commissionChartData = {
    labels: ['Pending', 'Active', 'Completed'],
    datasets: [{
      data: [stats?.pending_commissions || 0, stats?.active_commissions || 0, stats?.completed_commissions || 0],
      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
    }]
  }

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [3000, 4500, 4200, 5800, 6200, paymentStats?.monthly_revenue || 0],
      backgroundColor: '#0ea5e9',
    }]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Admin Dashboard</h1>
        <p className="text-morning-gray mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats?.total_users || 0} icon={UsersIcon} color="primary" />
        <StatsCard title="Total Artists" value={stats?.total_artists || 0} icon={PaintBrushIcon} color="success" />
        <StatsCard title="Total Commissions" value={stats?.total_commissions || 0} icon={BriefcaseIcon} color="warning" />
        <StatsCard title="Total Revenue" value={`$${stats?.total_revenue || 0}`} icon={CurrencyDollarIcon} color="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Commission Status</CardTitle>
          <div className="mt-4 h-64">
            <Doughnut data={commissionChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}} />
          </div>
        </Card>
        <Card>
          <CardTitle>Revenue Trend</CardTitle>
          <div className="mt-4 h-64">
            <Bar data={revenueChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }}}} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users"><Card hover><div className="flex items-center gap-3"><UsersIcon className="w-8 h-8 text-primary-500" /><div><p className="font-semibold">Manage Users</p><p className="text-sm text-morning-gray">{stats?.total_users} users</p></div></div></Card></Link>
        <Link to="/admin/artists"><Card hover><div className="flex items-center gap-3"><PaintBrushIcon className="w-8 h-8 text-emerald-500" /><div><p className="font-semibold">Manage Artists</p><p className="text-sm text-morning-gray">{stats?.total_artists} artists</p></div></div></Card></Link>
        <Link to="/admin/commissions"><Card hover><div className="flex items-center gap-3"><BriefcaseIcon className="w-8 h-8 text-amber-500" /><div><p className="font-semibold">Manage Commissions</p><p className="text-sm text-morning-gray">{stats?.total_commissions} total</p></div></div></Card></Link>
      </div>
    </div>
  )
}
