// /app/api/patients/prescriptions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  // Validate required query parameter
  if (!patientId) {
    return NextResponse.json(
      { message: 'patientId is required' },
      { status: 400 }
    );
  }

  try {
    const prescriptions = await prismaClient.prescription.findMany({
      where: {
        patientId: parseInt(patientId), // Ensure patientId is an integer
      },
      include: {
        doctor: true, // Include doctor details if needed
      },
    });

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const {
      patientId,
      doctorId,
      medication,
      dosage,
      startDate,
      endDate,
      prescribedBy,
    } = await req.json();

    // Validate required fields
    if (
      !patientId ||
      !doctorId ||
      !medication ||
      !dosage ||
      !startDate ||
      !endDate ||
      !prescribedBy
    ) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create new prescription
    const newPrescription = await prismaClient.prescription.create({
      data: {
        patientId: parseInt(patientId), // convert patientId to integer
        doctorId: parseInt(doctorId), // convert doctorId to integer
        medication,
        dosage,
        startDate: new Date(startDate), // ensure startDate is a valid Date object
        endDate: new Date(endDate), // ensure endDate is a valid Date object
      },
    });

    // Return the created prescription as the response
    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
