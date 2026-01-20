import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/authStore'
import { usersAPI } from '../../services/api'
import { Card, Button, Input } from '../../components/ui'
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  CameraIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function UserProfile() {
  const { user, updateUser, logout } = useAuthStore()
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
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-violet-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              <span className="text-4xl font-bold text-white">
                {user?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <CameraIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">
                {user?.first_name} {user?.last_name}
              </h1>
              {user?.role && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium capitalize">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  {user.role}
                </span>
              )}
            </div>
            <p className="text-white/80 mt-1">{user?.email}</p>
            {user?.profile?.bio && (
              <p className="text-white/70 mt-2 text-sm max-w-md">{user.profile.bio}</p>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Profile Form */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="!p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-500">Update your personal details here</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="John"
                    {...register('first_name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Doe"
                    {...register('last_name')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                    value={user?.email}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 000-0000"
                    {...register('phone')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all min-h-24 resize-none"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  {...register('bio')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="https://yourwebsite.com"
                    {...register('website')}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="New York"
                      {...register('city')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="United States"
                    {...register('country')}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary-500 to-violet-600 hover:from-primary-600 hover:to-violet-700 text-white rounded-xl font-medium shadow-lg shadow-primary-500/25"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card className="!p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Role</span>
                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-900 font-medium">
                  {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="!p-0 overflow-hidden border-red-100">
            <div className="px-6 py-4 border-b border-red-100 bg-red-50/50">
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            </div>
            <div className="p-6">
              <button
                onClick={logout}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
