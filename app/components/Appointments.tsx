import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, parseISO } from 'date-fns'
import axios from 'axios'

interface Appointment {
  id: string
  dateTime: string
  patientName: string
  age: number
  lastVisit: string
  reason: string
  status: 'pending' | 'confirmed'
}

const dummyAppointments: Appointment[] = [
  { id: '1', dateTime: '2023-06-20T09:00:00', patientName: 'John Doe', age: 35, lastVisit: '2023-01-15', reason: 'Annual Checkup', status: 'pending' },
  { id: '2', dateTime: '2023-06-20T10:30:00', patientName: 'Jane Smith', age: 28, lastVisit: '2023-03-22', reason: 'Follow-up', status: 'pending' },
  { id: '3', dateTime: '2023-06-20T14:00:00', patientName: 'Bob Johnson', age: 45, lastVisit: '2022-11-10', reason: 'Consultation', status: 'confirmed' },
  { id: '4', dateTime: '2023-06-21T11:00:00', patientName: 'Alice Brown', age: 52, lastVisit: '2023-05-05', reason: 'Test Results', status: 'pending' },
  { id: '5', dateTime: '2023-06-19T15:30:00', patientName: 'Charlie Wilson', age: 40, lastVisit: '2023-02-28', reason: 'Prescription Renewal', status: 'confirmed' },
  { id: '6', dateTime: '2023-06-22T13:00:00', patientName: 'Eva Martinez', age: 31, lastVisit: '2023-04-10', reason: 'Skin Rash', status: 'pending' },
  { id: '7', dateTime: '2023-06-22T16:00:00', patientName: 'David Lee', age: 55, lastVisit: '2023-01-20', reason: 'Blood Pressure Check', status: 'pending' },
  { id: '8', dateTime: '2023-06-23T10:00:00', patientName: 'Grace Taylor', age: 42, lastVisit: '2022-12-05', reason: 'Diabetes Follow-up', status: 'confirmed' },
]

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // Simulating data fetching delay
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`/api/doctors/appointments/all`, {
          params: { doctorId },
        });

        setAppointments(response.data.filter((appointments:any) => appointments.confirmed === true));
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, [doctorId])

  const handleConfirmAppointment = (id: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: 'confirmed' } : appointment
      )
    )
  }

  const pendingAppointments = appointments.filter(appointment => appointment.status === 'pending')
  const confirmedAppointments = appointments.filter(appointment => appointment.status === 'confirmed')

  if (appointments.length === 0) {
    return <div>Loading appointments...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>Manage your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({confirmedAppointments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <AppointmentTable
                appointments={pendingAppointments}
                onConfirm={handleConfirmAppointment}
                showActions={true}
              />
            </TabsContent>
            <TabsContent value="upcoming">
              <AppointmentTable
                appointments={confirmedAppointments}
                onConfirm={handleConfirmAppointment}
                showActions={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface AppointmentTableProps {
  appointments: Appointment[]
  onConfirm: (id: string) => void
  showActions: boolean
}

function AppointmentTable({ appointments, onConfirm, showActions }: AppointmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Last Visit</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{format(parseISO(appointment.dateTime), 'MMM d, yyyy HH:mm')}</TableCell>
            <TableCell>{appointment.patientName}</TableCell>
            <TableCell>{appointment.age}</TableCell>
            <TableCell>{format(parseISO(appointment.lastVisit), 'MMM d, yyyy')}</TableCell>
            <TableCell>{appointment.reason}</TableCell>
            <TableCell>
              <Badge 
                variant={appointment.status === 'confirmed' ? "default" : "default"}
              >
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </TableCell>
            {showActions && (
              <TableCell>
                {appointment.status === 'pending' && (
                  <Button 
                    onClick={() => onConfirm(appointment.id)}
                    variant="outline"
                    size="sm"
                  >
                    Confirm
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}