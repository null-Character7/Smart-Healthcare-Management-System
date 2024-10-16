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
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from 'date-fns'
import { Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Prescription {
  id: string
  medication: string
  dosage: string
  prescribedBy: string
  startDate: string
  endDate: string
  isConfirmed: boolean
}

const mockPrescriptions: Prescription[] = [
  { id: '1', medication: 'Amoxicillin', dosage: '500mg 3x daily', prescribedBy: 'Dr. Smith', startDate: '2023-06-15', endDate: '2023-06-22', isConfirmed: false },
  { id: '2', medication: 'Lisinopril', dosage: '10mg 1x daily', prescribedBy: 'Dr. Johnson', startDate: '2023-06-10', endDate: '2023-12-10', isConfirmed: false },
  { id: '3', medication: 'Metformin', dosage: '1000mg 2x daily', prescribedBy: 'Dr. Lee', startDate: '2023-05-01', endDate: '2023-11-01', isConfirmed: true },
  { id: '4', medication: 'Simvastatin', dosage: '20mg 1x daily', prescribedBy: 'Dr. Brown', startDate: '2023-06-20', endDate: '2024-06-20', isConfirmed: false },
]

export function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null)

  useEffect(() => {
    // In a real application, you would fetch prescriptions from an API here
    setPrescriptions(mockPrescriptions)
  }, [])

  const handleConfirmPrescription = (id: string) => {
    // In a real application, you would update the prescription status in your backend here
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id ? { ...prescription, isConfirmed: true } : prescription
      )
    )
    setConfirmationMessage(`Prescription ${id} has been confirmed.`)
    setTimeout(() => setConfirmationMessage(null), 3000) // Clear message after 3 seconds
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
          <CardDescription>Review and confirm your current prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmationMessage && (
            <Alert className="mb-4">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{confirmationMessage}</AlertDescription>
            </Alert>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.prescribedBy}</TableCell>
                  <TableCell>{format(parseISO(prescription.startDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(parseISO(prescription.endDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {prescription.isConfirmed ? (
                      <Badge variant="success">Confirmed</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!prescription.isConfirmed && (
                      <Button 
                        onClick={() => handleConfirmPrescription(prescription.id)}
                        variant="outline"
                        size="sm"
                      >
                        Confirm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {prescriptions.some(p => !p.isConfirmed) && (
            <Alert variant="warning" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                You have unconfirmed prescriptions. Please review and confirm them to ensure you're following your treatment plan.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}