import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInsurance extends Document {
  patient: Types.ObjectId;
  providerName: string;
  policyNumber: string;
  validTill: Date;
  filePath: string;
  createdAt: Date;
}

const InsuranceSchema = new Schema<IInsurance>({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  providerName: { type: String, required: true },
  policyNumber: { type: String, required: true },
  validTill: { type: Date, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Insurance || mongoose.model<IInsurance>('Insurance', InsuranceSchema);
