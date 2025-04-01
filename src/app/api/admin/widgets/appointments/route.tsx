import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');

  if (!dateStr) return NextResponse.json([], { status: 200 });

  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);

  const data = await Appointment.find({
    appointmentDate: { $gte: start, $lte: end },
  })
    .populate('patient', 'fullName')
    .populate('doctor', 'department');

  const result = data.map((item) => ({
    _id: item._id.toString(),
    patientName: item.patient?.fullName || 'Unknown',
    startTime: item.appointmentDate,
    endTime: new Date(
      new Date(item.appointmentDate).getTime() + 60 * 60 * 1000
    ), // +1 hr
    department: item.doctor?.department || 'General',
  }));

  return NextResponse.json(result);
}
