import { connectDB } from '@/lib/mongodb';
import Nurse from '@/models/Nurse';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const nurse = await Nurse.findById(params.id).lean();
  if (!nurse) return NextResponse.json({ error: 'Nurse not found' }, { status: 404 });
  return NextResponse.json(nurse);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const updated = await Nurse.findByIdAndUpdate(params.id, body, { new: true });
  if (!updated) return NextResponse.json({ error: 'Nurse not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const deleted = await Nurse.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ error: 'Nurse not found' }, { status: 404 });
  return NextResponse.json({ message: 'Nurse deleted' });
}
