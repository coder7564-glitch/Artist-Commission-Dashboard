import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { commissionsAPI, artistsAPI } from '../../services/api'
import { Card, Button, Input } from '../../components/ui'
import toast from 'react-hot-toast'

export default function NewCommission() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [artists, setArtists] = useState([])
  const [error, setError] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      artist_id: searchParams.get('artist') || '',
      priority: 'normal',
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsRes = await artistsAPI.getArtists({ status: 'approved' })
        setArtists(artistsRes.data.results || artistsRes.data || [])
      } catch (err) {
        console.error('Failed to fetch artists:', err)
        setError('Failed to load artists. Please try again.')
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await commissionsAPI.createCommission({
        title: data.title,
        description: data.description,
        artist_id: parseInt(data.artist_id),
        priority: data.priority,
        requirements: data.requirements || '',
        deadline: data.deadline || null,
      })
      toast.success('Commission request submitted!')
      navigate('/commissions')
    } catch (err) {
      console.error('Failed to create commission:', err)
      toast.error('Failed to create commission')
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <p className="text-accent-error mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">New Commission</h1>
        <p className="text-morning-gray mt-1">Submit a new commission request to an artist</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="label">Artist *</label>
            <select
              className={`input cursor-pointer ${errors.artist_id ? 'input-error' : ''}`}
              {...register('artist_id', { required: 'Please select an artist' })}
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.display_name}
                </option>
              ))}
            </select>
            {errors.artist_id && (
              <p className="mt-1 text-sm text-accent-error">{errors.artist_id.message}</p>
            )}
          </div>

          <Input
            label="Title *"
            placeholder="e.g., Character Portrait"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <div>
            <label className="label">Description *</label>
            <textarea
              className={`input min-h-32 ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe what you'd like the artist to create..."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-accent-error">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="label">Requirements / References</label>
            <textarea
              className="input min-h-24"
              placeholder="Any specific requirements, style references, or details..."
              {...register('requirements')}
            />
          </div>

          <div>
            <label className="label">Priority</label>
            <select className="input cursor-pointer" {...register('priority')}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent (+50% fee)</option>
            </select>
          </div>

          <Input
            label="Preferred Deadline"
            type="date"
            {...register('deadline')}
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Submit Commission Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
