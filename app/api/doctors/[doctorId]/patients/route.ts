// /app/api/doctors/[doctorId]/patients/route.ts
// const response = await fetch(`/api/doctors/${doctorId}/patients`);

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest, { params }: { params: { doctorId: string } }) {
  const doctorId = parseInt(params.doctorId);

  if (isNaN(doctorId)) {
    return NextResponse.json(
      { message: 'Invalid doctorId' },
      { status: 400 }
    );
  }

  try {
    // Fetch patients treated by the specified doctor
    const patients = await prismaClient.patient.findMany({
      where: {
        appointments: {
          some: {
            doctorId: doctorId,
          },
        },
      },
      include: {
        appointments: true, // Include appointments if needed
      },
    });

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
