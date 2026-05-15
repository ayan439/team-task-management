import { connectDB } from '@/lib/db'
import Task from '@/models/Task'
import { NextResponse } from 'next/server'

export async function PATCH(req, { params }) {
  try {
    await connectDB()

    const body = await req.json()

    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      {
        status: body.status,
      },
      {
        new: true,
      }
    )

    return NextResponse.json(updatedTask)
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

export async function DELETE(req, { params }) {
  try {
    await connectDB()

    await Task.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Task deleted successfully',
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