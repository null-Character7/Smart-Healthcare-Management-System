import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');
  const date = searchParams.get('date');

  // Validate required query parameters
  if (!patientId || !date) {
    return NextResponse.json(
      { message: 'Both patientId and date are required' },
      { status: 400 }
    );
  }

  try {
    const appointments = await prismaClient.appointment.findMany({
      where: {
        patientId: parseInt(patientId), // Ensure patientId is an integer
        date: new Date(date),             // Convert date string to Date object
      },
      include: {
        doctor: true, // Include doctor details if needed
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}