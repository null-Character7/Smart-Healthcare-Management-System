import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db'; // Adjust the import if necessary

export async function GET(req: NextRequest) {
  try {
    const patients = await prismaClient.patient.findMany();
    
    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Unable to fetch patients' }, { status: 500 });
  }
}
