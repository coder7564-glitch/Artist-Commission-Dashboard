import { useEffect, useState } from 'react'
import { commissionsAPI } from '../../services/api'
import { Card, StatusBadge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminCommissions() {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchCommissions() }, [filter])

  const fetchCommissions = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await commissionsAPI.getAdminCommissions(params)
      setCommissions(response.data.results || [])
    } catch (error) {
      toast.error('Failed to fetch commissions')
    } finally {
      setLoading(false)
    }
  }

  const filters = ['all', 'pending', 'in_progress', 'completed', 'cancelled']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Commissions</h1>
        <p className="text-morning-gray">Manage all commission requests</p>
      </div>

      <Card>
        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-primary-500 text-white' : 'bg-morning-soft text-morning-dark hover:bg-morning-muted'}`}>
              {f === 'all' ? 'All' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Title</TableHeader>
                <TableHeader>Client</TableHeader>
                <TableHeader>Artist</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {commissions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><span className="font-medium">{c.title}</span></TableCell>
                  <TableCell>{c.client_name}</TableCell>
                  <TableCell>{c.artist_name}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell>{c.final_price ? `$${c.final_price}` : '-'}</TableCell>
                  <TableCell>{format(new Date(c.created_at), 'MMM d, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
