import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { commissionsAPI, artistsAPI } from '../../services/api'
import { Card, CardTitle, Button, Input, Select } from '../../components/ui'
import toast from 'react-hot-toast'

export default function NewCommission() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [artists, setArtists] = useState([])
  const [categories, setCategories] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      artist_id: searchParams.get('artist') || '',
      priority: 'normal',
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, categoriesRes] = await Promise.all([
          artistsAPI.getArtists({ is_accepting_commissions: true }),
          commissionsAPI.getCategories(),
        ])
        setArtists(artistsRes.data.results || artistsRes.data || [])
        setCategories(categoriesRes.data || [])
      } catch (error) {
        console.error('Failed to fetch data')
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await commissionsAPI.createCommission({
        ...data,
        artist_id: parseInt(data.artist_id),
        category_id: data.category_id ? parseInt(data.category_id) : null,
      })
      toast.success('Commission request submitted!')
      navigate('/commissions')
    } catch (error) {
      toast.error('Failed to create commission')
    } finally {
      setLoading(false)
    }
  }

  const artistOptions = [
    { value: '', label: 'Select an artist' },
    ...artists.map(a => ({ value: a.id.toString(), label: a.display_name }))
  ]

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...categories.map(c => ({ value: c.id.toString(), label: c.name }))
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent (+50% fee)' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">New Commission</h1>
        <p className="text-morning-gray mt-1">Submit a new commission request to an artist</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            label="Artist *"
            options={artistOptions}
            error={errors.artist_id?.message}
            {...register('artist_id', { required: 'Please select an artist' })}
          />

          <Select
            label="Category"
            options={categoryOptions}
            {...register('category_id')}
          />

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

          <Select
            label="Priority"
            options={priorityOptions}
            {...register('priority')}
          />

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
