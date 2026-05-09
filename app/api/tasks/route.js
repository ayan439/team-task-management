import { connectDB } from '@/lib/db'
import Task from '@/models/Task'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const tasks = await Task.find().sort({
      createdAt: -1,
    })

    return NextResponse.json(tasks)
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

export async function POST(req) {
  try {
    await connectDB()

    const body = await req.json()

    const {
  title,
  status,
  priority,
  assignedTo,
  dueDate,
} = body

    if (!title) {
      return NextResponse.json(
        {
          message: 'Task title required',
        },
        {
          status: 400,
        }
      )
    }

    const task = await Task.create({
  title,
  status,
  priority,
  assignedTo,
  dueDate,
})

    return NextResponse.json(task)
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