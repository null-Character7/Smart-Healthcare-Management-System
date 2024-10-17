// pages/dashboard.tsx
"use client"
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DoctorDashboard } from '../components/DoctorDashboard';
import { PatientDashboard } from '../components/PatientDashboard';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const { data: session, status } = useSession(); // Access session and loading status

  // Check the session inside useEffect
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserRole(session.user.userType); // Set userRole from session
    } else {
      setUserRole(undefined); // Optionally reset or handle when user is not authenticated
    }
  }, [session, status]);

  // If the session is still loading, show a loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // If no session exists, show a "Not Authenticated" message
  if (!session) {
    return <p>You are not logged in.</p>;
  }

  return (
    <>
      {userRole === 'doctor' && <DoctorDashboard />}
      {userRole === 'patient' && <PatientDashboard />}
    </>
  );
}
