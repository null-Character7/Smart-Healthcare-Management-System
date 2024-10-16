import { NextRequest, NextResponse } from 'next/server';
import { prismaClient } from '@/app/lib/db'; // Ensure your prismaClient is correctly set up

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json();
        const { userType } = userData; // 'patient' or 'doctor'

        // Validate userType
        if (userType !== 'patient' && userType !== 'doctor') {
            return NextResponse.json(
                { message: 'Invalid user type. Must be "patient" or "doctor".' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingPatient = await prismaClient.patient.findUnique({
            where: { email: userData.email },
        })
        const existingDoctor = await prismaClient.doctor.findUnique({
            where: { email: userData.email },
        });

        if (existingPatient || existingDoctor) {
            return NextResponse.json(
                { message: 'Email already exists.' },
                { status: 400 }
            );
        }

        // Hash the password

        // Create user in the database
        const user =
            userType === 'patient'
                ? await prismaClient.patient.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        age: userData.age, // Only for patients
                    },
                })
                : await prismaClient.doctor.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password: userData.password,
                        specialty: userData.specialization, // Only for doctors
                    },
                });

        return NextResponse.json({ message: 'User created successfully!', user }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
