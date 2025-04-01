'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditPatientPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await axios.get(`/api/admin/patients/${id}`);
      setForm(res.data);
    };
    if (id) fetchPatient();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/admin/patients/${id}`, form);
      alert('Patient updated!');
      router.push('/admin/patients');
    } catch (err) {
      console.error(err);
      alert('Failed to update');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Patient</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
        <input name="dateOfBirth" type="date" value={form.dateOfBirth?.split('T')[0]} onChange={handleChange} className="input" />
        <select name="gender" value={form.gender} onChange={handleChange} className="input">
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" className="input" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="input col-span-2" />
        <input name="medicalHistory" value={form.medicalHistory} onChange={handleChange} placeholder="Medical History (comma-separated)" className="input col-span-2" />
      </div>

      <button onClick={handleSubmit} className="mt-6 bg-green-600 text-white px-6 py-3 rounded">Save Changes</button>
    </div>
  );
}
