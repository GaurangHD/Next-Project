'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const shifts = ['Day', 'Night'];

export default function EditNursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    licenseNumber: '',
    shift: 'Day',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchNurse = async () => {
      try {
        const res = await fetch(`/api/admin/nurses/${id}`);
        if (!res.ok) throw new Error('Failed to load nurse');
        const data = await res.json();
        setForm({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          licenseNumber: data.licenseNumber || '',
          shift: data.shift || 'Day',
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNurse();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch(`/api/admin/nurses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to update nurse');
      return;
    }

    router.push('/admin/nurses');
  };

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">✏️ Edit Nurse</h1>

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

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
            Update Nurse
          </button>
        </div>
      </form>
    </div>
  );
}
