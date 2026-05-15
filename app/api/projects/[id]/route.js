import { connectDB } from '@/lib/db'
import Task from '@/models/Task'
import { NextResponse } from 'next/server'

export async function PATCH(req, context) {
  try {
    await connectDB()

    const { id } = await context.params

    const body = await req.json()

    const updatedTask =
      await Task.findByIdAndUpdate(
        id,
        {
          status: body.status,
        },
        {
          new: true,
        }
      )

    if (!updatedTask) {
      return NextResponse.json(
        {
          message: 'Task not found',
        },
        {
          status: 404,
        }
      )
    }

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

export async function DELETE(req, context) {
  try {
    await connectDB()

    const { id } = await context.params

    const deletedTask =
      await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      return NextResponse.json(
        {
          message: 'Task not found',
        },
        {
          status: 404,
        }
      )
    }

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