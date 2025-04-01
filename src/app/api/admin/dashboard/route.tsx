import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import Nurse from '@/models/Nurse';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import Insurance from '@/models/Insurance';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();

  const [doctors, nurses, patients, appointments, insurance] = await Promise.all([
    Doctor.countDocuments(),
    Nurse.aggregate([
      { $group: { _id: '$shift', count: { $sum: 1 } } },
    ]),
    Patient.countDocuments(),
    Appointment.countDocuments({ appointmentDate: { $gte: new Date().setHours(0, 0, 0, 0) } }),
    Insurance.countDocuments(),
  ]);

  const cancelledInLast7Days = await Appointment.countDocuments({
    status: 'Cancelled',
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  });

  const nurseStats = { Day: 0, Night: 0 };
  nurses.forEach(n => {
    const shift = n._id as 'Day' | 'Night';
    nurseStats[shift] = n.count;
  });
  

  return NextResponse.json({
    totalDoctors: doctors,
    nurses: nurseStats,
    totalPatients: patients,
    appointmentsToday: appointments,
    totalInsurance: insurance,
    cancelledLastWeek: cancelledInLast7Days,
  });
}
