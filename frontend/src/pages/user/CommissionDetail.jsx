import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { commissionsAPI } from '../../services/api'
import { Card, CardTitle, Button, StatusBadge, Badge } from '../../components/ui'
import { ArrowLeftIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function UserCommissionDetail() {
  const { id } = useParams()
  const [commission, setCommission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommission()
  }, [id])

  const fetchCommission = async () => {
    try {
      const response = await commissionsAPI.getCommission(id)
      setCommission(response.data)
    } catch (error) {
      toast.error('Failed to load commission')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this commission?')) return
    
    try {
      await commissionsAPI.updateStatus(id, 'cancelled')
      toast.success('Commission cancelled')
      fetchCommission()
    } catch (error) {
      toast.error('Failed to cancel commission')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!commission) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-morning-gray">Commission not found</p>
          <Link to="/commissions" className="text-primary-500 mt-2 inline-block">
            Back to commissions
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/commissions" className="p-2 rounded-lg hover:bg-morning-soft">
          <ArrowLeftIcon className="w-5 h-5 text-morning-gray" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-morning-darker">{commission.title}</h1>
          <p className="text-morning-gray">Commission #{commission.id}</p>
        </div>
        <StatusBadge status={commission.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardTitle>Description</CardTitle>
            <p className="text-morning-dark mt-3 whitespace-pre-wrap">
              {commission.description}
            </p>
            {commission.requirements && (
              <div className="mt-4 pt-4 border-t border-morning-muted">
                <h4 className="font-medium text-morning-darker mb-2">Requirements</h4>
                <p className="text-morning-dark whitespace-pre-wrap">
                  {commission.requirements}
                </p>
              </div>
            )}
          </Card>

          {/* Revisions */}
          {commission.revisions?.length > 0 && (
            <Card>
              <CardTitle>Revisions</CardTitle>
              <div className="mt-4 space-y-4">
                {commission.revisions.map((revision) => (
                  <div key={revision.id} className="p-4 bg-morning-soft rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Revision #{revision.revision_number}</span>
                      {revision.is_approved && <Badge variant="success">Approved</Badge>}
                    </div>
                    {revision.artwork && (
                      <img
                        src={revision.artwork}
                        alt={`Revision ${revision.revision_number}`}
                        className="w-full max-w-md rounded-lg mt-2"
                      />
                    )}
                    {revision.notes && (
                      <p className="text-sm text-morning-gray mt-2">{revision.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Final Artwork */}
          {commission.final_artwork && (
            <Card>
              <CardTitle>Final Artwork</CardTitle>
              <img
                src={commission.final_artwork}
                alt="Final artwork"
                className="w-full rounded-lg mt-4"
              />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Artist Info */}
          <Card>
            <CardTitle>Artist</CardTitle>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {commission.artist?.display_name?.[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-morning-darker">
                  {commission.artist?.display_name}
                </p>
                <p className="text-sm text-morning-gray">
                  {commission.artist?.specialty}
                </p>
              </div>
            </div>
          </Card>

          {/* Details */}
          <Card>
            <CardTitle>Details</CardTitle>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between">
                <dt className="text-morning-gray">Category</dt>
                <dd className="font-medium">{commission.category?.name || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Priority</dt>
                <dd><Badge variant={commission.priority === 'urgent' ? 'error' : 'gray'}>{commission.priority}</Badge></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Price</dt>
                <dd className="font-medium">{commission.final_price ? `$${commission.final_price}` : 'TBD'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Deadline</dt>
                <dd>{commission.deadline ? format(new Date(commission.deadline), 'MMM d, yyyy') : '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Created</dt>
                <dd>{format(new Date(commission.created_at), 'MMM d, yyyy')}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-morning-gray">Revisions</dt>
                <dd>{commission.revisions_used} / {commission.revisions_allowed}</dd>
              </div>
            </dl>
          </Card>

          {/* Actions */}
          {commission.status === 'pending' && (
            <Card>
              <Button variant="danger" className="w-full" onClick={handleCancel}>
                Cancel Commission
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
