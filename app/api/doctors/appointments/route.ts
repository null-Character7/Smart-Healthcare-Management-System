// /app/api/doctors/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');

  // Validate required query parameters
  if (!doctorId || !date) {
    return NextResponse.json(
      { message: 'doctorId and date are required' },
      { status: 400 }
    );
  }

  try {
    // Convert date string to Date object
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0); // Set time to start of the day

    const appointments = await prismaClient.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId), // Ensure doctorId is an integer
        date: appointmentDate,
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
// GET /api/doctors/appointments?doctorId=1&date=2024-10-15
