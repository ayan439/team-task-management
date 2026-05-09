import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const users = await User.find().select(
      'name email role'
    )

    return NextResponse.json(users)
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