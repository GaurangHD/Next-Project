'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CreateDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialty: '',
    department: '',
    licenseNumber: '',
    yearsOfExperience: '',
    bio: '',
    shift: 'Day',
    availableDays: [] as string[],
    visitStartTime: '',
    visitEndTime: '',
  });

  const [error, setError] = useState('');
  const input =
    'w-full border border-gray-300 bg-white rounded-md px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (day: string) => {
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

    const res = await fetch('/api/admin/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        yearsOfExperience: Number(form.yearsOfExperience),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to create doctor');
      return;
    }

    router.push('/admin/doctors');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">➕ Add New Doctor</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name" required value={form.fullName} onChange={handleChange} className={input} />
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className={input} />
          <input name="phone" placeholder="Phone" required value={form.phone} onChange={handleChange} className={input} />
          <input name="specialty" placeholder="Specialty" required value={form.specialty} onChange={handleChange} className={input} />
          <input name="department" placeholder="Department" required value={form.department} onChange={handleChange} className={input} />
          <input name="licenseNumber" placeholder="License Number" required value={form.licenseNumber} onChange={handleChange} className={input} />
          <input name="yearsOfExperience" type="number" placeholder="Years of Experience" required value={form.yearsOfExperience} onChange={handleChange} className={input} />
        </div>

        {/* Shift Dropdown */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Shift</label>
          <select name="shift" value={form.shift} onChange={handleChange} className={input}>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Available Days */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Available Days</label>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day) => (
              <label key={day} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                  className="accent-blue-600"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        {/* Visit Times */}
        <div className="grid grid-cols-2 gap-4">
          <input type="time" name="visitStartTime" value={form.visitStartTime} onChange={handleChange} className={input} />
          <input type="time" name="visitEndTime" value={form.visitEndTime} onChange={handleChange} className={input} />
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Short Bio (optional)"
          value={form.bio}
          onChange={handleChange}
          className={`${input} h-24 resize-none`}
        />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition"
          >
            Save Doctor
          </button>
        </div>
      </form>
    </div>
  );
}
