// /app/api/doctors/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');

  console.log("Date received in backend:", date);

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

    console.log("Appointment Date:", appointmentDate.toISOString());

    // Fetch appointments for the doctor on the given day (ignoring time)
    const appointments = await prismaClient.appointment.findMany({
      where: {
        doctorId: parseInt(doctorId),
        date: {
          gte: appointmentDate,
          lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000), // Less than next day
        },
      },
      include: {
        patient: true, // Include patient details if needed
      },
    });

    console.log("Appointments found:", appointments.length);

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

export async function PUT(req: NextRequest) {
  try {
    // Parse the request body to get the appointment ID
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Appointment ID is required" }, { status: 400 });
    }

    // Update the appointment's confirmed field to true
    const updatedAppointment = await prismaClient.appointment.update({
      where: { id: Number(id) },
      data: { confirmed: true },
    });

    // Return the updated appointment as a JSON response
    return NextResponse.json(updatedAppointment, { status: 200 });

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
