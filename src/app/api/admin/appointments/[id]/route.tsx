import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Doctor from '@/models/Doctor';
import Nurse from '@/models/Nurse';
import Patient from '@/models/Patient';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const appointment = await Appointment.findById(params.id)
      .populate('doctor', 'fullName specialty')
      .populate('nurse', 'fullName')
      .populate('patient');

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (err) {
    console.error('Fetch appointment details error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
