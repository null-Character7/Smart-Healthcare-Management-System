import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db'; // Adjust the import if necessary

export async function GET(req: NextRequest) {
  try {
    const doctors = await prismaClient.doctor.findMany();
    
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Unable to fetch doctors' }, { status: 500 });
  }
}
