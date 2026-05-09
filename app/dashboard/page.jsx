'use client'

import Sidebar from '@/components/sidebar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = [
  '#22c55e',
  '#facc15',
  '#ef4444',
]

export default function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [selectedMember, setSelectedMember] =
    useState(null)

  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem('user')
    )

    setUser(storedUser)

    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')

      setTasks(response.data)
    } catch (error) {
      toast.error('Failed to load dashboard')
    }
  }

  // MEMBER ONLY SEES THEIR TASKS
  const filteredTasks =
    user?.role === 'member'
      ? tasks.filter(
          (task) =>
            task.assignedTo === user?.name
        )
      : tasks

  const completedTasks = filteredTasks.filter(
    (task) => task.status === 'completed'
  ).length

  const pendingTasks = filteredTasks.filter(
    (task) => task.status === 'pending'
  ).length

  const issueTasks = filteredTasks.filter(
    (task) => task.status === 'issue'
  ).length

  const memberStats = {}

  filteredTasks.forEach((task) => {
    if (!task.assignedTo) return

    if (!memberStats[task.assignedTo]) {
      memberStats[task.assignedTo] = {
        name: task.assignedTo,
        total: 0,
        completed: 0,
        pending: 0,
        issues: 0,
      }
    }

    memberStats[task.assignedTo].total++

    if (task.status === 'completed') {
      memberStats[task.assignedTo].completed++
    }

    if (task.status === 'pending') {
      memberStats[task.assignedTo].pending++
    }

    if (task.status === 'issue') {
      memberStats[task.assignedTo].issues++
    }
  })

  const membersArray =
    Object.values(memberStats)

  const pieData = [
    {
      name: 'Completed',
      value: completedTasks,
    },
    {
      name: 'Pending',
      value: pendingTasks,
    },
    {
      name: 'Issues',
      value: issueTasks,
    },
  ]

  const productivityData =
    membersArray.map((member) => ({
      name: member.name,
      tasks: member.completed,
    }))

  const stats = [
    {
      title: 'Total Tasks',
      value: filteredTasks.length,
      icon: ListTodo,
      color:
        'bg-purple-100 text-purple-600',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color:
        'bg-green-100 text-green-600',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock3,
      color:
        'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Issues',
      value: issueTasks,
      icon: FolderKanban,
      color:
        'bg-red-100 text-red-600',
    },
  ]

  return (
    <div className='lg:flex bg-slate-100 min-h-screen'>
      <Sidebar />

      <div className='flex-1 p-6 lg:p-8 mt-16 lg:mt-0'>
        <div className='flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-10'>
          <div>
            <h1 className='text-4xl font-bold text-slate-900'>
              Dashboard
            </h1>

            <p className='text-slate-500 mt-2 capitalize'>
              {user?.role} analytics
            </p>
          </div>

          <div className='bg-white px-5 py-3 rounded-2xl shadow-sm w-fit'>
            <p className='text-sm text-slate-500'>
              Productivity
            </p>

            <h2 className='text-2xl font-bold text-blue-600'>
              {filteredTasks.length > 0
                ? Math.round(
                    (completedTasks /
                      filteredTasks.length) *
                      100
                  )
                : 0}
              %
            </h2>
          </div>
        </div>

        {/* STATS */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
          {stats.map((stat) => (
            <div
              key={stat.title}
              className='bg-white rounded-3xl shadow-sm p-6'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-slate-500 text-sm'>
                    {stat.title}
                  </p>

                  <h2 className='text-4xl font-bold mt-3'>
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon size={28} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10'>
          <div className='bg-white rounded-3xl shadow-sm p-6'>
            <h2 className='text-2xl font-bold mb-6'>
              Productivity
            </h2>

            <div className='w-full h-[320px]'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <BarChart data={productivityData}>
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey='tasks'
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='bg-white rounded-3xl shadow-sm p-6'>
            <h2 className='text-2xl font-bold mb-6'>
              Task Status
            </h2>

            <div className='w-full h-[320px]'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey='value'
                    outerRadius={110}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[index %
                            COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ADMIN ONLY */}
        {user?.role === 'admin' && (
          <>
            <div className='bg-white rounded-3xl shadow-sm p-6 mt-10'>
              <h2 className='text-2xl font-bold mb-6'>
                Team Members Progress
              </h2>

              <div className='grid md:grid-cols-2 gap-6'>
                {membersArray.map((member) => (
                  <div
                    key={member.name}
                    onClick={() =>
                      setSelectedMember(member)
                    }
                    className='border rounded-2xl p-6 cursor-pointer hover:shadow-lg transition bg-slate-50'
                  >
                    <h3 className='text-2xl font-bold mb-6 capitalize'>
                      {member.name}
                    </h3>

                    <div className='space-y-4 text-lg'>
                      <p>
                        Total Tasks:{' '}
                        <span className='font-bold'>
                          {member.total}
                        </span>
                      </p>

                      <p className='text-green-600'>
                        Completed:{' '}
                        <span className='font-bold'>
                          {member.completed}
                        </span>
                      </p>

                      <p className='text-yellow-600'>
                        Pending:{' '}
                        <span className='font-bold'>
                          {member.pending}
                        </span>
                      </p>

                      <p className='text-red-600'>
                        Issues:{' '}
                        <span className='font-bold'>
                          {member.issues}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MEMBER DETAILS */}
            {selectedMember && (
              <div className='bg-white rounded-3xl p-8 mt-10 shadow-sm'>
                <h2 className='text-4xl font-bold mb-8 capitalize'>
                  {selectedMember.name} Performance
                </h2>

                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='w-full h-[350px]'>
                    <ResponsiveContainer
                      width='100%'
                      height='100%'
                    >
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: 'Completed',
                              value:
                                selectedMember.completed,
                            },
                            {
                              name: 'Pending',
                              value:
                                selectedMember.pending,
                            },
                            {
                              name: 'Issues',
                              value:
                                selectedMember.issues,
                            },
                          ]}
                          dataKey='value'
                          outerRadius={120}
                          label
                        >
                          <Cell fill='#22c55e' />
                          <Cell fill='#facc15' />
                          <Cell fill='#ef4444' />
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className='space-y-6'>
                    <div className='bg-slate-100 p-6 rounded-2xl'>
                      <p>Total Tasks</p>

                      <h2 className='text-5xl font-bold mt-2'>
                        {selectedMember.total}
                      </h2>
                    </div>

                    <div className='bg-green-100 p-6 rounded-2xl'>
                      <p className='text-green-700'>
                        Completed
                      </p>

                      <h2 className='text-5xl font-bold text-green-700 mt-2'>
                        {selectedMember.completed}
                      </h2>
                    </div>

                    <div className='bg-yellow-100 p-6 rounded-2xl'>
                      <p className='text-yellow-700'>
                        Pending
                      </p>

                      <h2 className='text-5xl font-bold text-yellow-700 mt-2'>
                        {selectedMember.pending}
                      </h2>
                    </div>

                    <div className='bg-red-100 p-6 rounded-2xl'>
                      <p className='text-red-700'>
                        Issues
                      </p>

                      <h2 className='text-5xl font-bold text-red-700 mt-2'>
                        {selectedMember.issues}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}