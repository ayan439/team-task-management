import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const projects = await Project.find().sort({
      createdAt: -1,
    })

    return NextResponse.json(projects)
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

    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json(
        {
          message: 'All fields required',
        },
        {
          status: 400,
        }
      )
    }

    const project = await Project.create({
      title,
      description,
    })

    return NextResponse.json(project)
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