// src/app/api/auth/login/route.ts
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { comparePassword } from '@/lib/hash';
import { signToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, // Generic message for security
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, // Generic message for security
        { status: 401 }
      );
    }

    const token = signToken({ id: admin._id });

    const response = NextResponse.json(
      { success: true, redirectTo: '/admin/dashboard' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax', // or 'strict'
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('Login successful, cookie set'); // Debug log
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}