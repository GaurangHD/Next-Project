"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function PatientListPage() {
  const [patients, setPatients] = useState([]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`/api/admin/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete patient");
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("/api/admin/patients");
        setPatients(res.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link
          href="/admin/patients/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Patient
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((p: any, index: number) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {p.fullName}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{p.email}</td>
                  <td className="px-6 py-4 text-gray-700">{p.phone}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/patients/${p._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaEye className="mr-1" />
                      View
                    </Link>
                    <Link
                      href={`/admin/patients/${p._id}/edit`}
                      className="inline-flex items-center text-yellow-500 hover:text-yellow-600"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="inline-flex items-center text-red-500 hover:text-red-600"
                    >
                      <FaTrash className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
