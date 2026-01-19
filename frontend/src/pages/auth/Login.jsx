import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    const result = await login(data.email, data.password)
    setIsLoading(false)

    if (result.success) {
      toast.success('Welcome back!')
      // Redirect based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-8">Sign in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="relative">
          <input
            type="email"
            id="email"
            placeholder=" "
            className={`
              peer w-full px-4 py-4 bg-blue-50/50 border-2 border-transparent rounded-2xl
              text-gray-900 text-base
              focus:outline-none focus:border-blue-500 focus:bg-white
              transition-all duration-200
              ${errors.email ? 'border-red-400 bg-red-50/50' : ''}
            `}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-4 text-gray-500 text-base transition-all duration-200
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600
              peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Email
          </label>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative">
          <input
            type="password"
            id="password"
            placeholder=" "
            className={`
              peer w-full px-4 py-4 bg-blue-50/50 border-2 border-transparent rounded-2xl
              text-gray-900 text-base
              focus:outline-none focus:border-blue-500 focus:bg-white
              transition-all duration-200
              ${errors.password ? 'border-red-400 bg-red-50/50' : ''}
            `}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-4 text-gray-500 text-base transition-all duration-200
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600
              peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Password
          </label>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-base shadow-lg shadow-blue-500/25 transition-all duration-200"
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
