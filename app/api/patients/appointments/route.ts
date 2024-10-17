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

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const { doctorId, patientId, date, timeSlot, reason } = await req.json();

    // Validate required fields
    if (!doctorId || !patientId || !date || !timeSlot || !reason) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create new appointment
    const newAppointment = await prismaClient.appointment.create({
      data: {
        doctorId: parseInt(doctorId), // convert doctorId to an integer
        patientId: parseInt(patientId), // convert patientId to an integer
        date: new Date(date), // make sure date is a valid Date object
        timeSlot,
        reason,
        confirmed:false
      },
    });

    // Return the created appointment as the response
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}