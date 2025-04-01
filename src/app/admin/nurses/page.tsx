"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Delete } from "@mui/icons-material";

interface Nurse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  licenseNumber: string;
  shift: string;
}

export default function NurseListPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/nurses")
      .then((res) => res.json())
      .then(setNurses);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this nurse?")) {
      await fetch(`/api/admin/nurses/${id}`, { method: "DELETE" });
      setNurses(nurses.filter((n) => n._id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">👩‍⚕️ Nurses</h1>
        <Link
          href="/admin/nurses/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add Nurse
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-auto border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">License</th>
              <th className="px-4 py-2">Shift</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse) => (
              <tr
                key={nurse._id}
                className="hover:bg-gray-50 cursor-pointer group"
                onClick={() => router.push(`/admin/nurses/${nurse._id}`)}
              >
                <td className="px-4 py-2">{nurse.fullName}</td>
                <td className="px-4 py-2">{nurse.email}</td>
                <td className="px-4 py-2">{nurse.phone}</td>
                <td className="px-4 py-2">{nurse.department}</td>
                <td className="px-4 py-2">{nurse.licenseNumber}</td>
                <td className="px-4 py-2">{nurse.shift}</td>
                <td
                  className="px-4 py-2 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      router.push(`/admin/nurses/${nurse._id}/edit`)
                    }
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <Edit fontSize="small" />
                  </button>
                  <button
                    onClick={() => handleDelete(nurse._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Delete fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
            {nurses.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-6">
                  No nurses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
       
        
      </div>
    </div>
  );
}
