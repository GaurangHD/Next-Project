import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import Nurse from '@/models/Nurse';
import Doctor from '@/models/Doctor';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      doctorId,
      appointmentDate,
      reason,
    } = body;

    if (!fullName || !email || !phone || !dateOfBirth || !gender || !address || !emergencyContact || !doctorId || !appointmentDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create patient
    const patient = await Patient.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
    });

    // Find any nurse to assign (you can later improve this with scheduling logic)
    const nurse = await Nurse.findOne().sort({ createdAt: 1 });
    if (!nurse) {
      return NextResponse.json({ error: 'No nurse available' }, { status: 503 });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      nurse: nurse._id,
      appointmentDate,
      reason,
    });

    return NextResponse.json({ message: 'Appointment booked ✅', appointment }, { status: 201 });
  } catch (err) {
    console.error('Book appointment error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
