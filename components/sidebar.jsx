'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  LogOut,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'Projects',
    icon: FolderKanban,
    href: '/projects',
  },
  {
    title: 'Tasks',
    icon: ListTodo,
    href: '/tasks',
  },
  {
    title: 'Team',
    icon: Users,
    href: '/team',
  },
]

export default function Sidebar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('user')

    router.push('/login')
  }

  return (
    <div className='w-64 min-h-screen bg-slate-950 text-white p-6 flex flex-col justify-between'>
      <div>
        <h1 className='text-2xl font-bold mb-10'>
          TaskFlow
        </h1>

        <div className='space-y-3'>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all'
            >
              <item.icon size={20} />

              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className='flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all'
      >
        <LogOut size={20} />

        Logout
      </button>
    </div>
  )
}