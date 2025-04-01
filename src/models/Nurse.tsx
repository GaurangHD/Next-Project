import mongoose, { Schema, Document } from 'mongoose';

export interface INurse extends Document {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  licenseNumber: string;
  shift: 'Day' | 'Night';
  availableDays: string[]; // e.g. ['Monday', 'Tuesday']
  shiftStartTime?: string; // Format: '08:00'
  shiftEndTime?: string;   // Format: '16:00'
  createdAt: Date;
}

const NurseSchema = new Schema<INurse>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  shift: { type: String, enum: ['Day', 'Night'], required: true },
  availableDays: [{ type: String }],
  shiftStartTime: { type: String },
  shiftEndTime: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Nurse || mongoose.model<INurse>('Nurse', NurseSchema);
