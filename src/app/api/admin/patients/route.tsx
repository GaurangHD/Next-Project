// /app/api/admin/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Insurance from '@/models/Insurance';

export async function GET() {
  await connectDB();
  const patients = await Patient.find().sort({ createdAt: -1 });
  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalHistory,
      insuranceList // array of insurance items with filePath
    } = body;

    // 1. Create Patient
    const patient = new Patient({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalHistory,
    });
    await patient.save();

    const insuranceIds: string[] = [];

    // 2. Create Insurance Docs
    if (insuranceList && Array.isArray(insuranceList)) {
      for (const item of insuranceList) {
        const insurance = new Insurance({
          patient: patient._id,
          providerName: item.providerName,
          policyNumber: item.policyNumber,
          validTill: item.validTill,
          filePath: item.filePath, // <--- updated from fileUrl to filePath
        });
        await insurance.save();
        insuranceIds.push(insurance._id.toString());
      }
    }

    // 3. Update Patient's insuranceDocs field
    patient.insuranceDocs = insuranceIds;
    await patient.save();

    return NextResponse.json({ success: true, patientId: patient._id });
  } catch (err) {
    console.error('[PATIENT_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
