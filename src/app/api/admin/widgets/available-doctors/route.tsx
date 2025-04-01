import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import Appointment from '@/models/Appointment';

export async function GET() {
  await connectDB();

  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }); // "Monday", "Tuesday", etc.

  // Start and end of today
  const start = new Date(now.setHours(0, 0, 0, 0));
  const end = new Date(now.setHours(23, 59, 59, 999));

  // Get busy doctors (already have appointments today)
  const todaysAppointments = await Appointment.find({
    appointmentDate: { $gte: start, $lte: end },
  });

  const busyDoctorIds = todaysAppointments.map((a) => a.doctor.toString());

  // Find doctors who are available today and not already booked
  const availableDoctors = await Doctor.find({
    _id: { $nin: busyDoctorIds },
    availableDays: { $in: [dayOfWeek] },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Format response
  const results = availableDoctors.map((doc) => ({
    name: doc.fullName,
    specialty: doc.specialty,
    date: new Date().toISOString(),
    visitTime: doc.visitStartTime || '10:00 AM',
    endTime: doc.visitEndTime || '04:00 PM',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=random`,
  }));

  return NextResponse.json(results);
}
