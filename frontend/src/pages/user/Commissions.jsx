import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { commissionsAPI } from '../../services/api'
import { Card, Button, StatusBadge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

export default function UserCommissions() {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchCommissions()
  }, [filter])

  const fetchCommissions = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await commissionsAPI.getCommissions(params)
      setCommissions(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch commissions')
    } finally {
      setLoading(false)
    }
  }

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-morning-darker">My Commissions</h1>
          <p className="text-morning-gray mt-1">Track and manage your commission requests</p>
        </div>
        <Link to="/commissions/new">
          <Button>
            <PlusIcon className="w-5 h-5 mr-2" />
            New Commission
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="w-5 h-5 text-morning-gray" />
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-morning-soft text-morning-dark hover:bg-morning-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Commissions Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : commissions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-morning-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-morning-darker mb-2">No commissions found</h3>
            <p className="text-morning-gray mb-4">Start by creating your first commission request</p>
            <Link to="/commissions/new">
              <Button>Create Commission</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Title</TableHeader>
              <TableHeader>Artist</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {commissions.map((commission) => (
              <TableRow
                key={commission.id}
                onClick={() => window.location.href = `/commissions/${commission.id}`}
                className="cursor-pointer"
              >
                <TableCell>
                  <span className="font-medium text-morning-darker">{commission.title}</span>
                </TableCell>
                <TableCell>{commission.artist_name}</TableCell>
                <TableCell>
                  <StatusBadge status={commission.status} />
                </TableCell>
                <TableCell>
                  {commission.final_price ? `$${commission.final_price}` : '-'}
                </TableCell>
                <TableCell>
                  {format(new Date(commission.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
