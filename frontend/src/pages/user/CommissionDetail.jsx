import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { commissionsAPI } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { Card, Button, Badge, Modal, Input } from '../../components/ui'
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  DocumentCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

// Status configuration
const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500', step: 0 },
  accepted: { label: 'Accepted', color: 'bg-blue-500', step: 1 },
  in_progress: { label: 'In Progress', color: 'bg-blue-500', step: 1 },
  revision: { label: 'Review', color: 'bg-purple-500', step: 2 },
  completed: { label: 'Completed', color: 'bg-emerald-500', step: 3 },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', step: -1 },
  rejected: { label: 'Rejected', color: 'bg-red-500', step: -1 },
}

const steps = [
  { label: 'Pending', icon: ClockIcon },
  { label: 'In Progress', icon: PencilSquareIcon },
  { label: 'Review', icon: DocumentCheckIcon },
  { label: 'Approved', icon: CheckCircleIcon },
]

export default function UserCommissionDetail() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [commission, setCommission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [quotedPrice, setQuotedPrice] = useState('')
  const [acceptLoading, setAcceptLoading] = useState(false)
  const fileInputRef = useRef(null)

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

  const handleStatusUpdate = async (newStatus) => {
    try {
      await commissionsAPI.updateStatus(id, newStatus)
      toast.success('Status updated')
      fetchCommission()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleAcceptWithPrice = async () => {
    if (!quotedPrice || parseFloat(quotedPrice) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    setAcceptLoading(true)
    try {
      // Update commission with quoted price first
      await commissionsAPI.updateCommission(id, {
        quoted_price: parseFloat(quotedPrice),
        final_price: parseFloat(quotedPrice),
        status: 'accepted'
      })
      toast.success('Commission accepted with price $' + quotedPrice)
      setShowPriceModal(false)
      setQuotedPrice('')
      fetchCommission()
    } catch (error) {
      toast.error('Failed to accept commission')
    } finally {
      setAcceptLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      await commissionsAPI.uploadReferenceImage(id, formData)
      toast.success('Image uploaded successfully')
      fetchCommission()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteImage = async (imageUrl) => {
    if (!confirm('Delete this image?')) return

    try {
      await commissionsAPI.deleteReferenceImage(id, imageUrl)
      toast.success('Image deleted')
      fetchCommission()
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  const currentStep = statusConfig[commission?.status]?.step ?? 0

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

  const isClient = user?.id === commission.client?.id
  const isArtist = user?.role === 'artist'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link to="/commissions" className="p-2 rounded-lg hover:bg-morning-soft w-fit">
          <ArrowLeftIcon className="w-5 h-5 text-morning-gray" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-morning-darker">{commission.title}</h1>
          <p className="text-morning-gray">Commission #{commission.id}</p>
        </div>

        {/* Action Button */}
        {commission.status === 'pending' && isArtist && (
          <Button onClick={() => setShowPriceModal(true)}>
            Accept Commission
          </Button>
        )}
        {commission.status === 'accepted' && isArtist && (
          <Button onClick={() => handleStatusUpdate('in_progress')}>
            Start Working
          </Button>
        )}
        {commission.status === 'in_progress' && isClient && (
          <Button variant="success" onClick={() => handleStatusUpdate('completed')}>
            Approve Commission
          </Button>
        )}
      </div>

      {/* Progress Stepper */}
      {currentStep >= 0 && (
        <Card className="!p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep
              const isActive = isCompleted || isCurrent

              return (
                <div key={step.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-primary-500 text-white' :
                        isCurrent ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500' :
                          'bg-morning-muted text-morning-gray'}
                    `}>
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-primary-600' : 'text-morning-gray'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${isCompleted ? 'bg-primary-500' : 'bg-morning-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-morning-darker mb-4">Description</h3>
            <p className="text-morning-dark whitespace-pre-wrap leading-relaxed">
              {commission.description}
            </p>
            {commission.requirements && (
              <div className="mt-6 pt-6 border-t border-morning-muted">
                <h4 className="font-medium text-morning-darker mb-2">Requirements</h4>
                <p className="text-morning-dark whitespace-pre-wrap">
                  {commission.requirements}
                </p>
              </div>
            )}
          </Card>

          {/* Reference Images / Files Card */}
          <Card className="!p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-morning-darker">Files & References</h3>
              {isClient && (
                <label className="cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <Button as="span" variant="secondary" size="sm" loading={uploading}>
                    <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </label>
              )}
            </div>

            {/* Upload Area */}
            {isClient && (!commission.reference_images?.length) && (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <div className="border-2 border-dashed border-morning-muted rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
                  <PhotoIcon className="w-12 h-12 text-morning-muted mx-auto mb-3" />
                  <p className="text-morning-gray">
                    {uploading ? 'Uploading...' : 'Drag & drop images or click to upload'}
                  </p>
                  <p className="text-xs text-morning-muted mt-1">JPEG, PNG, GIF, WebP up to 5MB</p>
                </div>
              </label>
            )}

            {/* Image Gallery */}
            {commission.reference_images?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {commission.reference_images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={img.url}
                      alt={img.filename || `Reference ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(img.url)}
                    />
                    {isClient && (
                      <button
                        onClick={() => handleDeleteImage(img.url)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                    <p className="text-xs text-morning-gray mt-1 truncate">{img.filename}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Revisions */}
          {commission.revisions?.length > 0 && (
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-morning-darker mb-4">Revisions</h3>
              <div className="space-y-4">
                {commission.revisions.map((revision) => (
                  <div key={revision.id} className="p-4 bg-morning-soft rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-morning-darker">
                        Revision #{revision.revision_number}
                      </span>
                      {revision.is_approved && (
                        <Badge variant="success">Approved</Badge>
                      )}
                    </div>
                    {revision.artwork && (
                      <img
                        src={revision.artwork}
                        alt={`Revision ${revision.revision_number}`}
                        className="w-full max-w-md rounded-lg cursor-pointer hover:opacity-90"
                        onClick={() => setSelectedImage(revision.artwork)}
                      />
                    )}
                    {revision.notes && (
                      <p className="text-sm text-morning-gray mt-3">{revision.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Final Artwork */}
          {commission.final_artwork && (
            <Card className="!p-6">
              <h3 className="text-lg font-semibold text-morning-darker mb-4">Final Artwork</h3>
              <img
                src={commission.final_artwork}
                alt="Final artwork"
                className="w-full rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => setSelectedImage(commission.final_artwork)}
              />
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Artist Info */}
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-morning-darker mb-4">Artist Info</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {commission.artist?.display_name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-morning-darker text-lg">
                  {commission.artist?.display_name}
                </p>
                <p className="text-morning-gray">{commission.artist?.specialty}</p>
              </div>
            </div>
          </Card>

          {/* Commission Specs */}
          <Card className="!p-6">
            <h3 className="text-lg font-semibold text-morning-darker mb-4">Commission Specs</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Category</dt>
                <dd className="font-medium text-morning-darker">{commission.category?.name || '-'}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Priority</dt>
                <dd>
                  <Badge variant={commission.priority === 'urgent' ? 'error' : commission.priority === 'high' ? 'warning' : 'gray'}>
                    {commission.priority?.charAt(0).toUpperCase() + commission.priority?.slice(1)}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Price</dt>
                <dd className="font-bold text-lg text-morning-darker">
                  {commission.final_price ? `$${commission.final_price}` : 'TBD'}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Deadline</dt>
                <dd className="font-medium">
                  {commission.deadline ? format(new Date(commission.deadline), 'MMM d, yyyy') : '-'}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Created</dt>
                <dd>{format(new Date(commission.created_at), 'MMM d, yyyy')}</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-morning-gray">Revisions</dt>
                <dd className="font-medium">{commission.revisions_used} / {commission.revisions_allowed}</dd>
              </div>
            </dl>
          </Card>

          {/* Cancel Button */}
          {commission.status === 'pending' && isClient && (
            <Card className="!p-6">
              <Button
                variant="danger"
                className="w-full"
                onClick={() => {
                  if (confirm('Cancel this commission?')) {
                    handleStatusUpdate('cancelled')
                  }
                }}
              >
                Cancel Commission
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
            onClick={() => setSelectedImage(null)}
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Price Modal */}
      {showPriceModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPriceModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-morning-darker">Set Commission Price</h3>
                <p className="text-sm text-morning-gray">Enter your quoted price for this commission</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-morning-darker mb-2">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-morning-gray text-lg">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="0.00"
                  className="input pl-8 text-lg font-semibold"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowPriceModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAcceptWithPrice}
                loading={acceptLoading}
              >
                Accept & Set Price
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
