// /api/admin/doctors/[id]/route.ts
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const doctor = await Doctor.findById(params.id).lean();
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });

    return NextResponse.json(doctor);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    const body = await req.json();
  
    try {
      const doctor = await Doctor.findByIdAndUpdate(params.id, body, { new: true });
      return NextResponse.json(doctor);
    } catch (err) {
      return NextResponse.json({ error: 'Update failed' }, { status: 400 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    try {
      await Doctor.findByIdAndDelete(params.id);
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
  }