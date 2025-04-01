'use client';

import { useEffect, useState } from 'react';

interface Doctor {
  name: string;
  specialty: string;
  date: string;
  visitTime: string;
  endTime: string;
  avatar: string;
}

export default function AvailableDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [is24Hour, setIs24Hour] = useState(false); // toggle state

  useEffect(() => {
    fetch('/api/admin/widgets/available-doctors')
      .then(res => res.json())
      .then(setDoctors);
  }, []);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    if (is24Hour) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const adjusted = hours % 12 || 12;
      return `${adjusted}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          ✅ Available Doctors
        </h2>

        {/* Toggle */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">12hr</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={is24Hour}
              onChange={() => setIs24Hour(!is24Hour)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-full transition-transform"></div>
          </label>
          <span className="text-gray-600">24hr</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-2">Doctor</th>
              <th className="px-4 py-2">Specialty</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Visit Time</th>
              <th className="px-4 py-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc, index) => (
              <tr key={index} className="bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                <td className="px-4 py-3 flex items-center gap-3 font-medium text-gray-800">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  />
                  <span>{doc.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{doc.specialty}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(doc.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">{formatTime(doc.visitTime)}</td>
                <td className="px-4 py-3 text-red-500 font-medium">{formatTime(doc.endTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {doctors.length === 0 && (
        <p className="text-gray-500 text-center text-sm mt-4">No doctors available today.</p>
      )}
    </div>
  );
}
