import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { NextResponse } from 'next/server'

export async function DELETE(req, context) {
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
        message: error.message,
      },
      {
        status: 500,
      }
    )
  }
}