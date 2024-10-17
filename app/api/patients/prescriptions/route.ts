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


export async function PUT(req: NextRequest) {
  try {
    // Parse the request body to extract the prescription ID
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Prescription ID is required" }, { status: 400 });
    }

    // Update the prescription's confirmed field to true
    const updatedPrescription = await prismaClient.prescription.update({
      where: { id: Number(id) },
      data: { confirmed: true },
    });

    // Return the updated prescription as a JSON response
    return NextResponse.json(updatedPrescription, { status: 200 });

  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
