'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Edit, Delete } from '@mui/icons-material';

const weekdays = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday'
];

interface Appointment {
  patientName: string;
  date: string;
  time: string;
}

interface Nurse {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  licenseNumber: string;
  shift: string;
  availableDays: string[];
  shiftStartTime: string;
  shiftEndTime: string;
}

// 👉 Format "14:00" to "2:00 PM"
function formatTo12Hour(time24: string): string {
  const [hoursStr, minutes] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function NurseProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [nurse, setNurse] = useState<Nurse | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchNurse = async () => {
      const res = await fetch(`/api/admin/nurses/${id}`);
      const data = await res.json();
      setNurse(data);
    };

    const fetchAppointments = async () => {
      const res = await fetch(`/api/admin/nurses/${id}/appointments`);
      const json = await res.json();
      setAppointments(json);
    };

    fetchNurse();
    fetchAppointments();
  }, [id]);

  if (!nurse)
    return <div className="p-6 text-gray-500">Loading nurse info...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
            {nurse.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{nurse.fullName}</h1>
            <p className="text-sm text-gray-500">
              👩‍⚕️ {nurse.department} | {nurse.shift} Shift
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"
            onClick={() => router.push(`/admin/nurses/${id}/edit`)}
          >
            <Edit fontSize="small" /> Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-red-600"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this nurse?')) {
                await fetch(`/api/admin/nurses/${id}`, { method: 'DELETE' });
                router.push('/admin/nurses');
              }
            }}
          >
            <Delete fontSize="small" /> Delete
          </button>
        </div>
      </div>

      {/* Weekly Shift Calendar */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🗓 Weekly Shift Schedule</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
          {weekdays.map((day) => {
            const isAvailable = nurse.availableDays?.includes(day);
            return (
              <div
                key={day}
                className={`rounded-lg p-4 shadow-sm transition-all duration-300 ${
                  isAvailable
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <h3 className="font-bold">{day}</h3>
                {isAvailable ? (
                  <p className="text-sm font-medium mt-2">
                    {formatTo12Hour(nurse.shiftStartTime)} – {formatTo12Hour(nurse.shiftEndTime)}
                  </p>
                ) : (
                  <p className="text-sm mt-2 italic">Unavailable</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
