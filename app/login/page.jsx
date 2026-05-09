'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await axios.post('/api/auth/login', formData)

      toast.success(response.data.message)

localStorage.setItem(
  'user',
  JSON.stringify(response.data.user)
)

router.push('/dashboard')
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-slate-900'>TaskFlow</h1>

          <p className='text-slate-500 mt-2'>
            Welcome back! Please login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='text-sm font-medium'>Email</label>

            <input
              type='email'
              name='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={handleChange}
              className='w-full mt-2 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='text-sm font-medium'>Password</label>

            <input
              type='password'
              name='password'
              placeholder='Enter your password'
              value={formData.password}
              onChange={handleChange}
              className='w-full mt-2 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 transition-all text-white p-4 rounded-xl font-semibold'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-sm text-slate-500 mt-6'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='text-blue-600 font-medium'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}