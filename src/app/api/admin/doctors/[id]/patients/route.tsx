import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Patient from '@/models/Patient';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid doctor ID' }, { status: 400 });
  }

  try {
    // Find appointments for this doctor and populate patient info
    const appointments = await Appointment.find({ doctor: id }).populate('patient', 'fullName email');
    console.log(appointments);
    // Extract unique patients
    const uniquePatients = new Map();
    appointments.forEach((a) => {
      const p = a.patient as any;
      if (p && !uniquePatients.has(p._id.toString())) {
        uniquePatients.set(p._id.toString(), {
          _id: p._id,
          fullName: p.fullName,
          email: p.email,
        });
      }
    });

    return NextResponse.json(Array.from(uniquePatients.values()));
  } catch (err) {
    console.error('Error fetching doctor patients:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
