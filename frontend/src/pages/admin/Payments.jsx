import { useEffect, useState } from 'react'
import { paymentsAPI, commissionsAPI } from '../../services/api'
import { Card, CardTitle, StatsCard, StatusBadge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui'
import { CurrencyDollarIcon, BanknotesIcon, ArrowTrendingUpIcon, TruckIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const [deliveredOrders, setDeliveredOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commissionsRes, statsRes] = await Promise.all([
          commissionsAPI.getAdminCommissions({ status: 'delivered' }),
          paymentsAPI.getAdminStats(),
        ])
        setDeliveredOrders(commissionsRes.data.results || commissionsRes.data || [])
        setStats(statsRes.data)
      } catch (error) {
        toast.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate totals from delivered orders
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + parseFloat(order.final_price || 0), 0)

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Payments</h1>
        <p className="text-morning-gray">Track all platform transactions from delivered orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={CurrencyDollarIcon} color="success" />
        <StatsCard title="Delivered Orders" value={deliveredOrders.length} icon={TruckIcon} color="primary" />
        <StatsCard title="Monthly Revenue" value={`$${stats?.monthly_revenue || 0}`} icon={ArrowTrendingUpIcon} color="info" />
      </div>

      <Card>
        <CardTitle>Delivered Orders / Transactions</CardTitle>
        {deliveredOrders.length === 0 ? (
          <div className="text-center py-8 text-morning-gray">
            No delivered orders yet
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Commission</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Artist</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Delivered On</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell><span className="font-mono text-sm">ORD-{order.id}</span></TableCell>
                  <TableCell className="font-medium">{order.title}</TableCell>
                  <TableCell>{order.client_name || order.client?.email || '-'}</TableCell>
                  <TableCell>{order.artist_name || order.artist?.display_name || '-'}</TableCell>
                  <TableCell className="font-bold text-emerald-600">${order.final_price || 0}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell>{order.updated_at ? format(new Date(order.updated_at), 'MMM d, yyyy') : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
