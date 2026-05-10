import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Project from '@/models/Project'

export async function DELETE(req, { params }) {
  try {
    await connectDB()

    await Project.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Project deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Delete failed' },
      { status: 500 }
    )
  }
}