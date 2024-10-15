// /app/api/doctors/appointments/all/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');

  // Validate required query parameter
  if (!doctorId) {
    return NextResponse.json(
      { message: 'doctorId is required' },
      { status: 400 }
    );
  }

  try {
    const appointments = await prismaClient.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId), // Ensure doctorId is an integer
      },
      include: {
        patient: true, // Include patient details if needed
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
