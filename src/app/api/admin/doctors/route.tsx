import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const doctors = await Doctor.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(doctors);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      specialty,
      department,
      licenseNumber,
      yearsOfExperience,
      bio,
      shift,
      availableDays,
      visitStartTime,
      visitEndTime,
    } = body;

    const newDoctor = await Doctor.create({
      fullName,
      email,
      phone,
      specialty,
      department,
      licenseNumber,
      yearsOfExperience,
      bio,
      shift,
      availableDays,
      visitStartTime,
      visitEndTime,
    });

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (err: any) {
    console.error('Doctor creation error:', err);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
