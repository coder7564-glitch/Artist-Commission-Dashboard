import { useEffect, useState } from 'react'
import { artistsAPI } from '../../services/api'
import { Card, Button, Badge, StatusBadge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui'
import { MagnifyingGlassIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

export default function AdminArtists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchArtists() }, [filter])

  const fetchArtists = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await artistsAPI.getAdminArtists(params)
      setArtists(response.data.results || response.data || [])
    } catch (error) {
      toast.error('Failed to fetch artists')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await artistsAPI.updateArtistStatus(id, status)
      toast.success(`Artist ${status}`)
      fetchArtists()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'suspended', label: 'Suspended' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Artists</h1>
        <p className="text-morning-gray">Manage artist accounts and approvals</p>
      </div>

      <Card>
        <div className="flex gap-2 mb-4 flex-wrap">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-primary-500 text-white' : 'bg-morning-soft text-morning-dark hover:bg-morning-muted'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Artist</TableHeader>
                <TableHeader>Specialty</TableHeader>
                <TableHeader>Rating</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-morning-darker">{artist.display_name}</p>
                      <p className="text-sm text-morning-gray">{artist.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{artist.specialty}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-amber-400" />
                      <span>{artist.rating || '0.0'}</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={artist.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {artist.status === 'pending' && (
                        <>
                          <Button size="sm" variant="success" onClick={() => updateStatus(artist.id, 'approved')}><CheckIcon className="w-4 h-4" /></Button>
                          <Button size="sm" variant="danger" onClick={() => updateStatus(artist.id, 'rejected')}><XMarkIcon className="w-4 h-4" /></Button>
                        </>
                      )}
                      {artist.status === 'approved' && (
                        <Button size="sm" variant="danger" onClick={() => updateStatus(artist.id, 'suspended')}>Suspend</Button>
                      )}
                      {artist.status === 'suspended' && (
                        <Button size="sm" variant="success" onClick={() => updateStatus(artist.id, 'approved')}>Reactivate</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
