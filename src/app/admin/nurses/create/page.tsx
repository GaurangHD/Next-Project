'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shifts = ['Day', 'Night'];

export default function CreateNursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    licenseNumber: '',
    shift: 'Day',
    availableDays: [] as string[],
    shiftStartTime: '',
    shiftEndTime: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDayToggle = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/nurses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create nurse');
      return;
    }

    router.push('/admin/nurses');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">➕ Add Nurse</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} className="input" />
          <input name="department" placeholder="Department" required value={form.department} onChange={handleChange} className="input" />
          <input name="licenseNumber" placeholder="License Number" required value={form.licenseNumber} onChange={handleChange} className="input" />
          <select name="shift" value={form.shift} onChange={handleChange} className="input">
            {shifts.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Available Days</label>
          <div className="flex flex-wrap gap-3">
            {weekdays.map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="time"
            name="shiftStartTime"
            value={form.shiftStartTime}
            onChange={handleChange}
            className="input"
            placeholder="Shift Start Time"
          />
          <input
            type="time"
            name="shiftEndTime"
            value={form.shiftEndTime}
            onChange={handleChange}
            className="input"
            placeholder="Shift End Time"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
            Save Nurse
          </button>
        </div>
      </form>
    </div>
  );
}
