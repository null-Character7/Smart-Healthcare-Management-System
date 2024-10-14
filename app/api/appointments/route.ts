import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

//   const response = await fetch(`/api/appointments?date=${date}&doctorId=${doctorId}`);
export async function GET(req: NextRequest) {
    try {
      // Get query parameters
      const query = req.nextUrl.searchParams;
      const date = query.get('date'); // Expecting 'YYYY-MM-DD' format
      const doctorId = Number(query.get('doctorId'));
  
      // Check if both date and doctorId are provided
      if (!date || isNaN(doctorId)) {
        return NextResponse.json(
          { message: 'Both date and doctorId are required' },
          { status: 400 }
        );
      }
  
      // Convert date from string to DateTime
      const dateObj = new Date(date);
  
      // Fetch appointments for the given date and doctor
      const appointments = await prismaClient.appointment.findMany({
        where: {
          date: {
            gte: new Date(dateObj.setHours(0, 0, 0, 0)), // Start of the day
            lt: new Date(dateObj.setHours(23, 59, 59, 999)), // End of the day
          },
          doctorId, // Filter by doctorId
        },
        include: {
          doctor: true, // Include doctor details
          patient: true, // Include patient details
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