import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { usersAPI } from '../../services/api'
import { Card, CardTitle, Button, Input } from '../../components/ui'
import toast from 'react-hot-toast'

export default function UserProfile() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
      bio: user?.profile?.bio || '',
      website: user?.profile?.website || '',
      city: user?.profile?.city || '',
      country: user?.profile?.country || '',
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const response = await usersAPI.updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        profile: {
          bio: data.bio,
          website: data.website,
          city: data.city,
          country: data.country,
        }
      })
      updateUser(response.data)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-morning-darker">Profile Settings</h1>
        <p className="text-morning-gray mt-1">Manage your account information</p>
      </div>

      <Card>
        <CardTitle>Personal Information</CardTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input label="Email" value={user?.email} disabled />
          <Input label="Phone" {...register('phone')} />

          <div>
            <label className="label">Bio</label>
            <textarea className="input min-h-24" {...register('bio')} />
          </div>

          <Input label="Website" type="url" {...register('website')} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City" {...register('city')} />
            <Input label="Country" {...register('country')} />
          </div>

          <Button type="submit" loading={loading}>Save Changes</Button>
        </form>
      </Card>
    </div>
  )
}
