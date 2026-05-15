'use client'

import Sidebar from '@/components/sidebar'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] =
    useState(null)

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    )

    setUser(storedUser)

    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        '/api/projects'
      )

      setProjects(response.data)
    } catch (error) {
      toast.error('Failed to fetch projects')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user?.role !== 'admin') {
      return toast.error(
        'Only admin can create projects'
      )
    }

    try {
      setLoading(true)

      await axios.post(
        '/api/projects',
        formData
      )

      toast.success('Project created')

      setFormData({
        title: '',
        description: '',
      })

      fetchProjects()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='lg:flex bg-slate-100 min-h-screen'>
      <Sidebar />

      <div className='flex-1 p-6 lg:p-8 lg:ml-0 mt-16 lg:mt-0'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold'>
              Projects
            </h1>

            <p className='text-slate-500 mt-2'>
              Logged in as:{' '}
              <span className='font-semibold capitalize'>
                {user?.role}
              </span>
            </p>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className='bg-white rounded-2xl shadow-sm p-6 mb-8'>
            <h2 className='text-xl font-semibold mb-4'>
              Create New Project
            </h2>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <input
                type='text'
                placeholder='Project title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className='w-full p-4 border rounded-xl'
              />

              <textarea
                placeholder='Project description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description:
                      e.target.value,
                  })
                }
                className='w-full p-4 border rounded-xl h-32'
              />

              <button
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl'
              >
                {loading
                  ? 'Creating...'
                  : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() =>
                setSelectedProject(project)
              }
              className='bg-white rounded-3xl shadow-sm p-6 border hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-[260px] cursor-pointer'
            >
              <div>
                <div className='flex items-start justify-between gap-4'>
                  <h2 className='text-2xl font-bold text-slate-900 line-clamp-1'>
                    {project.title}
                  </h2>

                  {user?.role === 'admin' && (
                    <button
  onClick={async () => {
    try {
      await axios.delete(
        `/api/projects/${project._id}`
      )

      setProjects((prevProjects) =>
        prevProjects.filter(
          (p) => p._id !== project._id
        )
      )

      toast.success('Project deleted')
    } catch (error) {
      toast.error('Delete failed')
    }
  }}
                      className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm'
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className='text-slate-500 mt-4 line-clamp-5 overflow-hidden'>
                  {project.description}
                </p>
              </div>

              <div className='mt-6 flex items-center justify-between'>
                <span className='text-sm text-slate-400'>
                  Active Project
                </span>

                <div className='w-3 h-3 rounded-full bg-green-500'></div>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-3xl p-8 max-w-2xl w-full relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto'>
              <button
                onClick={() =>
                  setSelectedProject(null)
                }
                className='absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl'
              >
                Close
              </button>

              <h2 className='text-3xl font-bold text-slate-900 mb-6 pr-20'>
                {selectedProject.title}
              </h2>

              <div className='space-y-6'>
                <div>
                  <p className='text-sm text-slate-400 mb-2'>
                    Project Description
                  </p>

                  <p className='text-lg leading-8 text-slate-700 whitespace-pre-wrap break-words'>
                    {
                      selectedProject.description
                    }
                  </p>
                </div>

                <div className='flex items-center gap-3 pt-4 border-t'>
                  <div className='w-3 h-3 rounded-full bg-green-500'></div>

                  <span className='text-slate-500 font-medium'>
                    Active Project
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}