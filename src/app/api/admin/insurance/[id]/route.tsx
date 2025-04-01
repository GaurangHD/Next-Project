import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Insurance from '@/models/Insurance';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const records = await Insurance.find({ patient: params.id }).sort({ createdAt: -1 });
    return NextResponse.json(records);
  } catch (err) {
    console.error('[GET_INSURANCE_BY_PATIENT]', err);
    return NextResponse.json({ error: 'Failed to fetch insurance records' }, { status: 500 });
  }
}
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectDB();
      const body = await req.json();
  
      const updated = await Insurance.findByIdAndUpdate(params.id, {
        providerName: body.providerName,
        policyNumber: body.policyNumber,
        validTill: body.validTill,
        filePath: body.filePath,
      }, { new: true });
  
      return NextResponse.json(updated);
    } catch (err) {
      console.error('[INSURANCE_UPDATE_ERROR]', err);
      return NextResponse.json({ error: 'Failed to update insurance' }, { status: 500 });
    }
  }