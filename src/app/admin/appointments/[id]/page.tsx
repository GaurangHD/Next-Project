'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CalendarMonth,
  MedicalServices,
  Person,
  Assignment,
  Email,
  Phone,
  LocationOn,
  Badge,
} from '@mui/icons-material';

interface Appointment {
  _id: string;
  appointmentDate: string;
  reason: string;
  status: string;
  createdAt: string;
  doctor: { fullName: string; specialty?: string };
  nurse: { fullName: string };
  patient: {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
  };
}

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/admin/appointments/${id}`);
      const data = await res.json();
      setAppointment(data);
    };
    fetchData();
  }, [id]);

  if (!appointment) return <div className="p-6">Loading appointment...</div>;

  const statusColor =
    appointment.status === 'Completed'
      ? 'bg-green-100 text-green-800'
      : appointment.status === 'Cancelled'
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Assignment className="text-blue-600" /> Appointment Details
        </h1>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
          {appointment.status}
        </span>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointment Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <CalendarMonth fontSize="small" /> Appointment Info
          </h2>
          <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
          <p><strong>Reason:</strong> {appointment.reason}</p>
          <p><strong>Created At:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
        </div>

        {/* Patient Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <Person fontSize="small" /> Patient Info
          </h2>
          <p><strong>Name:</strong> {appointment.patient.fullName}</p>
          <p><strong>Email:</strong> {appointment.patient.email}</p>
          <p><strong>Phone:</strong> {appointment.patient.phone}</p>
          <p><strong>Gender:</strong> {appointment.patient.gender}</p>
          <p><strong>Address:</strong> {appointment.patient.address}</p>
        </div>

        {/* Doctor Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <MedicalServices fontSize="small" /> Assigned Doctor
          </h2>
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
              {appointment.doctor.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{appointment.doctor.fullName}</p>
              <p className="text-sm text-gray-500">{appointment.doctor.specialty}</p>
            </div>
          </div>
        </div>

        {/* Nurse Info */}
        <div className="bg-white shadow rounded-lg p-6 space-y-2">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
            <Badge fontSize="small" /> Assigned Nurse
          </h2>
          <div className="flex items-center gap-3">
            <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
              {appointment.nurse?.fullName.charAt(0)}
            </div>
            <p>{appointment.nurse?.fullName || 'Not Assigned'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
