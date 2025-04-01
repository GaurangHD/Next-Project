"use client";
import { useState } from "react";
import axios from "axios";

export default function CreatePatientPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const [insuranceList, setInsuranceList] = useState([
    {
      providerName: "",
      policyNumber: "",
      validTill: "",
      file: null,
      filePath: "",
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleInsuranceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...insuranceList];
    const { name, value, files } = e.target;

    if (name === "file") {
      updated[index].file = files ? files[0] : null;
    } else {
      updated[index][name] = value;
    }
    setInsuranceList(updated);
  };

  const addInsurance = () => {
    setInsuranceList([
      ...insuranceList,
      {
        providerName: "",
        policyNumber: "",
        validTill: "",
        file: null,
        filePath: "",
      },
    ]);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/api/admin/insurance/upload", formData);
    return res.data.filePath;
  };

  const submit = async () => {
    try {
      const insuranceWithPaths = await Promise.all(
        insuranceList.map(async (ins) => {
          const filePath = ins.file ? await uploadFile(ins.file) : "";
          return {
            providerName: ins.providerName,
            policyNumber: ins.policyNumber,
            validTill: ins.validTill,
            filePath,
          };
        })
      );

      const payload = {
        ...form,
        medicalHistory: form.medicalHistory.split(",").map((x) => x.trim()),
        insuranceList: insuranceWithPaths,
      };

      await axios.post("/api/admin/patients", payload);
      alert("Patient created!");
    } catch (err) {
      console.error(err);
      alert("Error creating patient");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Patient</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="fullName"
          placeholder="Full Name"
          className="input"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="input"
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          className="input"
          onChange={handleChange}
        />
        <input
          name="dateOfBirth"
          type="date"
          className="input"
          onChange={handleChange}
        />
        <select name="gender" className="input" onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input
          name="emergencyContact"
          placeholder="Emergency Contact"
          className="input"
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          className="input col-span-2"
          onChange={handleChange}
        />
        <input
          name="medicalHistory"
          placeholder="Medical History (comma-separated)"
          className="input col-span-2"
          onChange={handleChange}
        />
      </div>

      <h2 className="text-xl mt-6 mb-2 font-semibold">Insurance Info</h2>
      {insuranceList.map((ins, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            name="providerName"
            placeholder="Provider"
            className="input"
            value={ins.providerName}
            onChange={(e) => handleInsuranceChange(i, e)}
          />
          <input
            name="policyNumber"
            placeholder="Policy Number"
            className="input"
            value={ins.policyNumber}
            onChange={(e) => handleInsuranceChange(i, e)}
          />
          <input
            name="validTill"
            type="date"
            className="input"
            value={ins.validTill}
            onChange={(e) => handleInsuranceChange(i, e)}
          />
          <div>
            <input
              name="file"
              type="file"
              className="input"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(e) => handleInsuranceChange(i, e)}
            />
            {ins.file && (
              <p className="text-sm mt-1 text-gray-600">
                Selected:{" "}
                <span className="font-medium">{ins.file.name}</span>
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addInsurance}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Add Insurance
      </button>

      <div className="mt-6">
        <button
          onClick={submit}
          className="px-6 py-3 bg-green-600 text-white rounded"
        >
          Create Patient
        </button>
      </div>
    </div>
  );
}
