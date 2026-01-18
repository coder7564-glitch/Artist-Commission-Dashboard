import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import { Button, Input, Select } from '../../components/ui'

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuthStore()
  const navigate = useNavigate()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'client' }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    const result = await registerUser(data)
    setIsLoading(false)
    
    if (result.success) {
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } else {
      toast.error('Registration failed. Please try again.')
    }
  }

  const roleOptions = [
    { value: 'client', label: 'Client - I want to commission art' },
    { value: 'artist', label: 'Artist - I want to offer commissions' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-morning-darker mb-2">Create account</h2>
      <p className="text-morning-gray mb-6">Join our creative community</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register('first_name', { required: 'First name is required' })}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register('last_name', { required: 'Last name is required' })}
          />
        </div>

        <Input
          label="Username"
          placeholder="johndoe"
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Select
          label="I am a..."
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.password_confirm?.message}
          {...register('password_confirm', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" className="w-full" loading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-morning-gray">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
