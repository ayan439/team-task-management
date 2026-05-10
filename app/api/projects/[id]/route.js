import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Project from '@/models/Project'

export async function DELETE(request, context) {
  try {
    await connectDB()

    const { id } = await context.params

    await Project.findByIdAndDelete(id)

    return NextResponse.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Delete failed',
      },
      { status: 500 }
    )
  }
}