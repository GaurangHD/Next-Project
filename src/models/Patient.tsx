import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  emergencyContact: string;
  medicalHistory?: string[];
  insuranceDocs: string[];
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  medicalHistory: [{ type: String }],
  insuranceDocs: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
