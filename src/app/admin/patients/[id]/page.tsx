'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function PatientProfilePage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [insuranceDocs, setInsuranceDocs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await axios.get(`/api/admin/patients/${id}`);
        setPatient(patientRes.data);

        const insuranceRes = await axios.get(`/api/admin/insurance/${id}`);
        setInsuranceDocs(insuranceRes.data);
      } catch (err) {
        console.error('Error fetching patient/insurance data:', err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleInsuranceUpdate = async (doc: any) => {
    try {
      let filePath = doc.filePath;

      if (doc.newFile) {
        const formData = new FormData();
        formData.append("file", doc.newFile);
        const uploadRes = await axios.post("/api/insurance/upload", formData);
        filePath = uploadRes.data.filePath;
      }

      const payload = {
        providerName: doc.providerName,
        policyNumber: doc.policyNumber,
        validTill: doc.validTill,
        filePath,
      };

      await axios.put(`/api/admin/insurance/${doc._id}`, payload);
      alert("Insurance updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update insurance");
    }
  };

  if (!patient) return <div className="p-6">Loading patient details...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        <div><strong>Name:</strong> {patient.fullName}</div>
        <div><strong>Email:</strong> {patient.email}</div>
        <div><strong>Phone:</strong> {patient.phone}</div>
        <div><strong>Gender:</strong> {patient.gender}</div>
        <div><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
        <div><strong>Address:</strong> {patient.address}</div>
        <div><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
      </div>

      <h2 className="text-xl font-semibold mb-2 mt-6">Insurance Documents</h2>
      <div className="bg-white p-4 rounded shadow space-y-4">
        {insuranceDocs.length > 0 ? (
          insuranceDocs.map((doc: any, i: number) => (
            <div key={i} className="border p-4 rounded shadow-sm space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  className="input"
                  defaultValue={doc.providerName}
                  onChange={(e) => (doc.providerName = e.target.value)}
                />
                <input
                  className="input"
                  defaultValue={doc.policyNumber}
                  onChange={(e) => (doc.policyNumber = e.target.value)}
                />
                <input
                  className="input"
                  type="date"
                  defaultValue={doc.validTill?.split('T')[0]}
                  onChange={(e) => (doc.validTill = e.target.value)}
                />
                <input
                  className="input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => (doc.newFile = e.target.files?.[0])}
                />
              </div>

              <div className="flex justify-between items-center mt-2">
                <a
                  href={doc.filePath}
                  className="text-blue-600 underline"
                  download
                  target="_blank"
                >
                  Download Current File
                </a>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleInsuranceUpdate(doc)}
                >
                  Update
                </button>
              </div>

              {doc.filePath.endsWith('.pdf') && (
                <iframe
                  src={doc.filePath}
                  className="w-full h-64 rounded border"
                ></iframe>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No insurance documents uploaded.</p>
        )}
      </div>
    </div>
  );
}
