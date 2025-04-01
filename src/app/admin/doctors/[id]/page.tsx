'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Edit, Delete } from '@mui/icons-material';

interface Patient {
  fullName: string;
  email: string;
  phone: string;
}

interface Doctor {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string;
  shift: string;
  availableDays: string[];
  visitStartTime?: string;
  visitEndTime?: string;
}

export default function DoctorProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch(`/api/admin/doctors/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setDoctor(data);
    };

    const fetchPatients = async () => {
      const res = await fetch(`/api/admin/doctors/${id}/patients`);
      if (!res.ok) return;
      const json = await res.json();
      setPatients(json);
    };

    fetchDoctor();
    fetchPatients();
  }, [id]);

  if (!doctor) return <p className="p-6 text-gray-600">Loading doctor...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xl font-bold shadow-inner">
            {doctor.fullName[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{doctor.fullName}</h1>
            <p className="text-gray-500 text-sm">{doctor.specialty}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1"
            onClick={() => router.push(`/admin/doctors/${id}/edit`)}
          >
            <Edit fontSize="small" />
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this doctor?')) {
                await fetch(`/api/admin/doctors/${id}`, { method: 'DELETE' });
                router.push('/admin/doctors');
              }
            }}
          >
            <Delete fontSize="small" />
            Delete
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm text-gray-400 font-semibold mb-2">Contact</h2>
          <p><span className="font-medium">📧 Email:</span> {doctor.email}</p>
          <p><span className="font-medium">📞 Phone:</span> {doctor.phone}</p>
          <p><span className="font-medium">🏥 Department:</span> {doctor.department}</p>
          <p><span className="font-medium">📜 License:</span> {doctor.licenseNumber}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-sm text-gray-400 font-semibold mb-2">Work Info</h2>
          <p><span className="font-medium">🧠 Experience:</span> {doctor.yearsOfExperience} years</p>
          <p><span className="font-medium">🕒 Shift:</span> {doctor.shift}</p>
          <p><span className="font-medium">📅 Days:</span> {doctor.availableDays.join(', ')}</p>
          <p><span className="font-medium">⏰ Time:</span> {doctor.visitStartTime} - {doctor.visitEndTime}</p>
        </div>
      </div>

      {/* Bio */}
      {doctor.bio && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">📝 Bio</h2>
          <p className="text-gray-600">{doctor.bio}</p>
        </div>
      )}

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">👥 Patients Assigned</h2>
        {patients.length ? (
          <ul className="space-y-3">
            {patients.map((p, i) => (
              <li key={i} className="border border-gray-100 rounded-md px-4 py-2 shadow-sm hover:shadow-md transition">
                <p className="text-gray-800 font-medium">{p.fullName}</p>
                <p className="text-sm text-gray-500">{p.email} • {p.phone}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">No patients assigned.</p>
        )}
      </div>
    </div>
  );
}
