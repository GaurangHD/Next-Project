'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EditDoctorPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id;

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

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await fetch(`/api/admin/doctors/${doctorId}`);
      const data = await res.json();
      setForm({ ...data, yearsOfExperience: data.yearsOfExperience.toString() });
    };
    fetchDoctor();
  }, [doctorId]);

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

    const res = await fetch(`/api/admin/doctors/${doctorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, yearsOfExperience: Number(form.yearsOfExperience) }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to update doctor');
      return;
    }

    router.push('/admin/doctors');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">✏️ Edit Doctor</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} className="input" placeholder="Full Name" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="Phone" required />
          <input name="specialty" value={form.specialty} onChange={handleChange} className="input" placeholder="Specialty" required />
          <input name="department" value={form.department} onChange={handleChange} className="input" placeholder="Department" required />
          <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="input" placeholder="License Number" required />
          <input name="yearsOfExperience" value={form.yearsOfExperience} type="number" onChange={handleChange} className="input" placeholder="Experience (years)" required />
        </div>

        <div>
          <label className="block font-medium mb-1">Shift</label>
          <select name="shift" value={form.shift} onChange={handleChange} className="input">
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Available Days</label>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="time" name="visitStartTime" value={form.visitStartTime} onChange={handleChange} className="input" />
          <input type="time" name="visitEndTime" value={form.visitEndTime} onChange={handleChange} className="input" />
        </div>

        <textarea name="bio" value={form.bio} onChange={handleChange} className="input h-24" placeholder="Bio" />

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">Update Doctor</button>
        </div>
      </form>
    </div>
  );
}
