import { connectDB } from '@/lib/db'
import Task from '@/models/Task'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const totalTasks = await Task.countDocuments()

    const completedTasks =
      await Task.countDocuments({
        status: 'completed',
      })

    const pendingTasks =
      await Task.countDocuments({
        status: 'pending',
      })

    const issueTasks =
      await Task.countDocuments({
        status: 'issue',
      })

    const members = await User.find({
      role: 'member',
    })

    const memberStats = await Promise.all(
      members.map(async (member) => {
        const total =
          await Task.countDocuments({
            assignedTo: member.name,
          })

        const completed =
          await Task.countDocuments({
            assignedTo: member.name,
            status: 'completed',
          })

        const pending =
          await Task.countDocuments({
            assignedTo: member.name,
            status: 'pending',
          })

        const issues =
          await Task.countDocuments({
            assignedTo: member.name,
            status: 'issue',
          })

        return {
          name: member.name,
          total,
          completed,
          pending,
          issues,
        }
      })
    )

    return NextResponse.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      issueTasks,
      memberStats,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    )
  }
}