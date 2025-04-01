import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  department: string;
  licenseNumber: string;
  yearsOfExperience: number;
  bio?: string;
  shift: 'Day' | 'Night' | 'Custom';
  availableDays: string[]; // e.g., ['Monday', 'Wednesday']
  visitStartTime?: string; // Format: '09:00'
  visitEndTime?: string;   // Format: '17:00'
  createdAt: Date;
  isDeleted: { type: Boolean, default: false },

}

const DoctorSchema = new Schema<IDoctor>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialty: { type: String, required: true },
  department: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  yearsOfExperience: { type: Number, required: true },
  bio: { type: String },
  shift: { type: String, enum: ['Day', 'Night', 'Custom'], default: 'Day' },
  availableDays: [{ type: String }], 
  visitStartTime: { type: String },  
  visitEndTime: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
