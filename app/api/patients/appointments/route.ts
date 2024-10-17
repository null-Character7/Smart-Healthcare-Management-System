import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  // Validate required query parameters
  if (!patientId) {
    return NextResponse.json(
      { message: 'patientId is required' },
      { status: 400 }
    );
  }

  try {
    const currentDate = new Date(); // Get the current date and time

    const upcomingAppointments = await prismaClient.appointment.findMany({
      where: {
        patientId: parseInt(patientId), // Ensure patientId is an integer
        date: {
          gte: currentDate, // Filter for appointments with date >= current date (upcoming)
        },
        confirmed:true
      },
      include: {
        doctor: true, // Include doctor details
      },
      orderBy: {
        date: 'asc', // Optionally sort the appointments by date
      },
    });

    return NextResponse.json(upcomingAppointments, { status: 200 });
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