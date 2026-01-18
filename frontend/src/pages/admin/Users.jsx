import { useEffect, useState } from 'react'
import { usersAPI } from '../../services/api'
import { Card, CardTitle, Button, Input, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal } from '../../components/ui'
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers()
      setUsers(response.data.results || response.data || [])
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await usersAPI.deleteUser(id)
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  const roleColors = { admin: 'error', artist: 'primary', client: 'gray' }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-morning-darker">Users</h1>
          <p className="text-morning-gray">Manage platform users</p>
        </div>
      </div>

      <Card>
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-morning-gray" />
          <input type="text" placeholder="Search users..." className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>User</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Joined</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{user.email[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-morning-darker">{user.username}</p>
                        <p className="text-sm text-morning-gray">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={roleColors[user.role]}>{user.role}</Badge></TableCell>
                  <TableCell>{user.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="gray">Inactive</Badge>}</TableCell>
                  <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-morning-soft rounded" onClick={() => { setSelectedUser(user); setModalOpen(true) }}><PencilIcon className="w-4 h-4 text-morning-gray" /></button>
                      <button className="p-1 hover:bg-red-50 rounded" onClick={() => handleDelete(user.id)}><TrashIcon className="w-4 h-4 text-accent-error" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit User">
        {selectedUser && (
          <div className="space-y-4">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
