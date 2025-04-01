'use client';

import { useState, useEffect } from 'react';

interface Doctor {
  _id: string;
  fullName: string;
  specialty: string;
}

export default function BookAppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    reason: '',
    doctorId: '',
    appointmentDate: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/doctors')
      .then(res => res.json())
      .then(setDoctors);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const res = await fetch('/api/public/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setSuccess('✅ Appointment booked successfully!');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        address: '',
        emergencyContact: '',
        reason: '',
        doctorId: '',
        appointmentDate: '',
      });
    } else {
      setError(data.error || '❌ Failed to book appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Left Image Side */}
        <div className="bg-blue-800 text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">🩺 Welcome to Our Healthcare Center</h2>
          <p className="text-blue-100 mb-6">Book an appointment with one of our expert doctors and start your journey to better health.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Healthcare Illustration"
            className="w-full max-w-sm mx-auto"
          />
        </div>

        {/* Right Form Side */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h1 className="text-2xl font-bold text-blue-800">📅 Book Appointment</h1>

          {success && <p className="text-green-600 font-medium">{success}</p>}
          {error && <p className="text-red-600 font-medium">{error}</p>}

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Full Name</label>
              <input name="fullName" required value={form.fullName} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Phone</label>
              <input name="phone" required value={form.phone} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Date of Birth</label>
              <input name="dateOfBirth" type="date" required value={form.dateOfBirth} onChange={handleChange} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Emergency Contact</label>
              <input name="emergencyContact" required value={form.emergencyContact} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Address + Reason */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Address</label>
            <input name="address" required value={form.address} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Reason for Appointment</label>
            <textarea name="reason" required value={form.reason} onChange={handleChange} className="input h-24 resize-none" />
          </div>

          {/* Doctor + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Select Doctor</label>
              <select name="doctorId" required value={form.doctorId} onChange={handleChange} className="input">
                <option value="">-- Select Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.fullName} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Appointment Date & Time</label>
              <input name="appointmentDate" type="datetime-local" required value={form.appointmentDate} onChange={handleChange} className="input" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-md shadow-sm transition"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
