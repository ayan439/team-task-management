'use client'

import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
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

      const response = await axios.post('/api/auth/signup', formData)

      toast.success(response.data.message)

      router.push('/login')
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
          <h1 className='text-4xl font-bold text-slate-900'>
            Create Account
          </h1>

          <p className='text-slate-500 mt-2'>
            Join TaskFlow today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='text-sm font-medium'>Name</label>

            <input
              type='text'
              name='name'
              placeholder='Enter your name'
              value={formData.name}
              onChange={handleChange}
              className='w-full mt-2 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

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
              placeholder='Create password'
              value={formData.password}
              onChange={handleChange}
              className='w-full mt-2 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='text-sm font-medium'>Role</label>

            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full mt-2 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='member'>Member</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 transition-all text-white p-4 rounded-xl font-semibold'
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className='text-center text-sm text-slate-500 mt-6'>
          Already have an account?{' '}
          <Link href='/login' className='text-blue-600 font-medium'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}