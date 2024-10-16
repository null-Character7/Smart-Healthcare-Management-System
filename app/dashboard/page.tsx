// pages/dashboard.tsx
"use client"
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { DoctorDashboard } from '../components/DoctorDashboard';
import { PatientDashboard } from '../components/PatientDashboard';
import { useRecoilState } from 'recoil';
import { role } from '../recoil/atoms';

export default function Dashboard() {
  const [userRole,setUserRole] = useRecoilState(role); // Set the role in Recoil

  const { data: session, status } = useSession(); // Access session and loading status

  // Check the session inside useEffect
  useEffect(() => {
    if (session && session.user) {
      setUserRole(session.user.userType)
    }
  }, [session]);

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
