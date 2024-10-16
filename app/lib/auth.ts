import CredentialsProvider from 'next-auth/providers/credentials';
import { prismaClient } from './db';

export const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'email', type: 'text', placeholder: '' },
        password: { label: 'password', type: 'password', placeholder: '' },
      },
      async authorize(credentials: any) {
        console.log("credentials are ", credentials)
        const { email, password } = credentials;

        // Check if the user is a patient
        const patient = await prismaClient.patient.findUnique({
          where: { email },
        });

        // If patient found, verify password and return patient details
        if (patient) {
          // Replace this with your actual password verification logic
          const isPasswordValid = patient.password === password; // Use bcrypt or another hashing method in production

          if (isPasswordValid) {
            console.log("password correct, patient")
            return {
              id: patient.id,
              name: patient.name,
              userId: patient.id,
              email: patient.email,
              userType: 'patient',
            };
          }
        }

        // Check if the user is a doctor
        const doctor = await prismaClient.doctor.findUnique({
          where: { email },
        });

        // If doctor found, verify password and return doctor details
        if (doctor) {
          // Replace this with your actual password verification logic
          const isPasswordValid = doctor.password === password; // Use bcrypt or another hashing method in production

          if (isPasswordValid) {
            console.log("password correct, doctor")
            return {
              id: doctor.id,
              name: doctor.name,
              userId: doctor.id,
              email: doctor.email,
              userType: 'doctor',
            };
          }
        }

        // If no user found or password is invalid, return null
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id; // Add user id to token
        token.userType = user.userType; // Add user type to token
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id; // Add user id to session
      session.user.userType = token.userType; // Add user type to session
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
}