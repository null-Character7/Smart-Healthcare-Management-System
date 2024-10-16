"use client"
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
import { format, isSameDay, parseISO, startOfToday } from 'date-fns'

interface Appointment {
  id: string
  patientName: string
  age: number
  lastVisit: string
  reason: string
  dateTime: string
}

const mockAppointments: Appointment[] = [
  { id: '1', patientName: 'John Doe', age: 35, lastVisit: '2023-05-15', reason: 'Annual Checkup', dateTime: '2023-06-20T09:00:00' },
  { id: '2', patientName: 'Jane Smith', age: 28, lastVisit: '2023-04-22', reason: 'Follow-up', dateTime: '2023-06-20T10:30:00' },
  { id: '3', patientName: 'Bob Johnson', age: 45, lastVisit: '2023-03-10', reason: 'Consultation', dateTime: '2023-06-20T14:00:00' },
  { id: '4', patientName: 'Alice Brown', age: 52, lastVisit: '2023-05-30', reason: 'Test Results', dateTime: '2023-06-21T11:00:00' },
  { id: '5', patientName: 'Charlie Wilson', age: 40, lastVisit: '2023-06-05', reason: 'Prescription Renewal', dateTime: '2023-06-21T15:30:00' },
]

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    // In a real application, you would fetch appointments from an API here
    const sortedAppointments = [...mockAppointments].sort((a, b) => {
      const dateA = parseISO(a.dateTime)
      const dateB = parseISO(b.dateTime)
      if (isSameDay(dateA, dateB)) {
        return dateA.getTime() - dateB.getTime()
      }
      return dateA.getTime() - dateB.getTime()
    })
    setAppointments(sortedAppointments)
  }, [])

  const handleConfirmAppointment = (id: string) => {
    // In a real application, you would update the appointment status in your backend here
    console.log(`Confirming appointment with id: ${id}`)
  }

  const today = startOfToday()

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointments List</CardTitle>
          <CardDescription>View and manage upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                const appointmentDate = parseISO(appointment.dateTime)
                const isToday = isSameDay(appointmentDate, today)
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <span className={isToday ? "font-bold text-primary" : ""}>
                        {format(appointmentDate, 'MMM d, yyyy')}
                      </span>
                      <br />
                      {format(appointmentDate, 'h:mm a')}
                    </TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.age}</TableCell>
                    <TableCell>{format(parseISO(appointment.lastVisit), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{appointment.reason}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleConfirmAppointment(appointment.id)}
                        variant="outline"
                        size="sm"
                      >
                        Confirm
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}