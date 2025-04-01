'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Doctor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
}

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetch('/api/admin/doctors')
      .then(res => res.json())
      .then(setDoctors);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">🩺 Doctor Management</h1>
        <Link
          href="/admin/doctors/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow"
        >
          ➕ Add Doctor
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead className="bg-gray-100">
            <tr className="text-gray-600">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Specialty</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id} className="bg-white hover:bg-gray-50 transition">
                <td className="px-5 py-3 font-medium text-gray-900">{doc.fullName}</td>
                <td className="px-5 py-3 text-gray-700">{doc.email}</td>
                <td className="px-5 py-3 text-gray-700">{doc.phone}</td>
                <td className="px-5 py-3 text-gray-700">{doc.specialty}</td>
                <td className="px-5 py-3 text-gray-700">{doc.department}</td>
                <td className="px-5 py-3 text-center">
                  <Link
                    href={`/admin/doctors/${doc._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
            {doctors.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
