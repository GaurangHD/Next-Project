import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';

export async function GET() {
  try {
    await connectDB();

    // Create today's start and end range correctly
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    console.log('Date range:', { start, end }); // Debug log

    // Fetch appointments for today
    const appointments = await Appointment.find({
      appointmentDate: { 
        $gte: start, 
        $lte: end 
      },
      status: 'Scheduled',
    })
    .populate('doctor', 'fullName')
    .populate('patient', 'fullName');

    console.log('Found appointments:', appointments.length); // Debug log

    // Format response
    const result = appointments.map((a) => ({
      id: a._id,
      doctorName: a.doctor?.fullName || 'Unknown',
      patientName: a.patient?.fullName || 'Unknown',
      date: a.appointmentDate,
      reason: a.reason,
      status: a.status,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('[TODAY_APPOINTMENTS_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}