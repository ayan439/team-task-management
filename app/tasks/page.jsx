'use client'
import Sidebar from '@/components/sidebar'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  
  const [members, setMembers] = useState([])

  const [user, setUser] = useState(null)
  const filteredTasks =
  user?.role === 'member'
    ? tasks.filter(
        (task) =>
          task.assignedTo === user?.name
      )
    : tasks

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
  title: '',
  status: 'pending',
  priority: 'medium',
  assignedTo: '',
  dueDate: '',
})

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'))

  setUser(storedUser)

  fetchTasks()

  fetchMembers()
}, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')

      setTasks(response.data)
    } catch (error) {
      toast.error('Failed to fetch tasks')
    }
  }

  const fetchMembers = async () => {
  try {
    const response = await axios.get('/api/users')

    setMembers(response.data)
  } catch (error) {
    toast.error('Failed to fetch members')
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user?.role !== 'admin') {
      return toast.error('Only admin can create tasks')
    }

    try {
      setLoading(true)

      await axios.post('/api/tasks', formData)

      toast.success('Task created')

      setFormData({
  title: '',
  status: 'pending',
  priority: 'medium',
  assignedTo: '',
  dueDate: '',
})

      fetchTasks()
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
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>Tasks</h1>

          <p className='text-slate-500 mt-2'>
            Logged in as:{' '}
            <span className='font-semibold capitalize'>
              {user?.role}
            </span>
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className='bg-white rounded-2xl shadow-sm p-6 mb-8'>
            <h2 className='text-xl font-semibold mb-4'>
              Create Task
            </h2>

            <form
              onSubmit={handleSubmit}
              className='space-y-4'
            >
              <input
                type='text'
                placeholder='Task title'
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className='w-full p-4 border rounded-xl'
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className='w-full p-4 border rounded-xl'
              >
                <option value='pending'>Pending</option>
                <option value='in-progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>

              <select
  value={formData.priority}
  onChange={(e) =>
    setFormData({
      ...formData,
      priority: e.target.value,
    })
  }
  className='w-full p-4 border rounded-xl'
>
  <option value='low'>Low</option>
  <option value='medium'>Medium</option>
  <option value='high'>High</option>
</select>

<select
  value={formData.assignedTo}
  onChange={(e) =>
    setFormData({
      ...formData,
      assignedTo: e.target.value,
    })
  }
  className='w-full p-4 border rounded-xl'
>
  <option value=''>Assign to member</option>

  {members.map((member) => (
  <option
    key={member._id}
    value={member.name}
  >
    {member.name}
  </option>
))}
</select>

<input
  type='date'
  value={formData.dueDate}
  onChange={(e) =>
    setFormData({
      ...formData,
      dueDate: e.target.value,
    })
  }
  className='w-full p-4 border rounded-xl'
/>

              <button
                disabled={loading}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl'
              >
                {loading
                  ? 'Creating...'
                  : 'Create Task'}
              </button>
            </form>
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-sm p-6 overflow-x-auto'>
          <table className='w-full'>
            <thead>
  <tr className='border-b text-left'>
    <th className='py-4'>Task</th>
    <th>Status</th>
    <th>Priority</th>
    <th>Assigned To</th>
    <th>Update Status</th>
    <th>Action</th>
  </tr>
</thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task._id}
                  className='border-b'
                >
                  <td className='py-4 font-medium'>
                    {task.title}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td
  className={`font-medium
  ${
    task.priority === 'high'
      ? 'text-red-500'
      : ''
  }`}
>
  {task.priority}
</td>

<td>{task.assignedTo}</td>

<td>
  {user?.role === 'member' && (
    <select
      value={task.status}
      onChange={async (e) => {
        try {
          await axios.patch(`/api/tasks/${task._id}`, {
            status: e.target.value,
          })

          fetchTasks()

          toast.success('Status updated')
        } catch (error) {
          toast.error('Update failed')
        }
      }}
      className='border p-2 rounded-lg'
    >
      <option value='pending'>Pending</option>
      <option value='in-progress'>
        In Progress
      </option>
      <option value='completed'>
        Completed
      </option>
      <option value='issue'>Having Issue</option>
    </select>
  )}
</td>

<td>
  {user?.role === 'admin' && (
    <button
      onClick={async () => {
        try {
          await axios.delete(
            `/api/tasks/${task._id}`
          )

          fetchTasks()

          toast.success('Task deleted')
        } catch (error) {
          toast.error('Delete failed')
        }
      }}
      className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl'
    >
      Delete
    </button>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}