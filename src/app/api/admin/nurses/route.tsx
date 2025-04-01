import { connectDB } from '@/lib/mongodb';
import Nurse from '@/models/Nurse';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const nurses = await Nurse.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(nurses);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      department,
      licenseNumber,
      shift,
      availableDays,
      shiftStartTime,
      shiftEndTime,
    } = body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !licenseNumber ||
      !shift ||
      !availableDays?.length ||
      !shiftStartTime ||
      !shiftEndTime
    ) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const exists = await Nurse.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: 'Nurse with this email already exists.' }, { status: 409 });
    }

    const nurse = await Nurse.create({
      fullName,
      email,
      phone,
      department,
      licenseNumber,
      shift,
      availableDays,
      shiftStartTime,
      shiftEndTime,
    });

    return NextResponse.json(nurse, { status: 201 });
  } catch (err) {
    console.error('Error creating nurse:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
