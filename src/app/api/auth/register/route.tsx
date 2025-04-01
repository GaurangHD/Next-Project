import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/hash';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();
  const { username, email, password } = await req.json();

  const existing = await Admin.findOne({ email });
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

  const hashedPassword = await hashPassword(password);
  const newAdmin = await Admin.create({ username, email, password: hashedPassword });

  return NextResponse.json({ message: 'Admin registered', admin: newAdmin });
}
