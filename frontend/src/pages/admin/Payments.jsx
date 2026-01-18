import { useEffect, useState } from 'react'
import { paymentsAPI } from '../../services/api'
import { Card, CardTitle, StatsCard, StatusBadge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui'
import { CurrencyDollarIcon, BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, statsRes] = await Promise.all([
          paymentsAPI.getAdminPayments(),
          paymentsAPI.getAdminStats(),
        ])
        setPayments(paymentsRes.data.results || [])
        setStats(statsRes.data)
      } catch (error) {
        toast.error('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Payments</h1>
        <p className="text-morning-gray">Track all platform transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Total Revenue" value={`$${stats?.total_revenue || 0}`} icon={CurrencyDollarIcon} color="success" />
        <StatsCard title="Platform Fees" value={`$${stats?.total_platform_fees || 0}`} icon={BanknotesIcon} color="primary" />
        <StatsCard title="Monthly Revenue" value={`$${stats?.monthly_revenue || 0}`} icon={ArrowTrendingUpIcon} color="info" />
      </div>

      <Card>
        <CardTitle>Recent Transactions</CardTitle>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Transaction ID</TableHeader>
              <TableHeader>Commission</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell><span className="font-mono text-sm">{p.transaction_id || `TXN-${p.id}`}</span></TableCell>
                <TableCell>{p.commission_title}</TableCell>
                <TableCell className="font-medium">${p.amount}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>{format(new Date(p.created_at), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
