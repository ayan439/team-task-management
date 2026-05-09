'use client'

import Sidebar from '@/components/sidebar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function TeamPage() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/users')

      setMembers(response.data)
    } catch (error) {
      toast.error('Failed to fetch users')
    }
  }

  return (
    <div className='lg:flex bg-slate-100 min-h-screen'>
      <Sidebar />

      <div className='flex-1 p-6 lg:p-8 lg:ml-0 mt-16 lg:mt-0'>
        <h1 className='text-4xl font-bold mb-8'>
          Team Members
        </h1>

        <div className='bg-white rounded-3xl shadow-sm p-6 overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b text-left'>
                <th className='pb-4'>Name</th>
                <th className='pb-4'>Role</th>
                <th className='pb-4'>Email</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr
                  key={member._id}
                  className='border-b last:border-none'
                >
                  <td className='py-5 font-medium'>
                    {member.name}
                  </td>

                  <td>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium
                      ${
                        member.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  <td>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}