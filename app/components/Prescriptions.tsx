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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format, parseISO } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import { userId } from '../recoil/atoms'
import { useRecoilValue } from 'recoil'
import axios from 'axios'

interface Prescription {
  id: string
  medication: string
  dosage: string
  prescribedBy: string
  startDate: string
  endDate: string
  confirmed: boolean
}


export function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const patientId = useRecoilValue(userId);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      console.log("patient id is ", patientId);
      try {
        const response = await axios.get(`/api/patients/prescriptions`, {
          params: { patientId },
        });
        setPrescriptions(response.data); // Axios automatically parses JSON
      } catch (error: any) {
        console.error("Error fetching prescriptions:", error);
      } finally {
      }
    };
    fetchPrescriptions();
  }, [patientId])

  const handleConfirmPrescription = (id: string) => {
    setPrescriptions(prevPrescriptions =>
      prevPrescriptions.map(prescription =>
        prescription.id === id ? { ...prescription, isConfirmed: true } : prescription
      )
    )
  }

  const confirmedPrescriptions = prescriptions.filter(p => p.confirmed)
  const unconfirmedPrescriptions = prescriptions.filter(p => !p.confirmed)

  if (prescriptions.length === 0) {
    return <div>Loading prescriptions...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
          <CardDescription>Review and confirm your current prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {unconfirmedPrescriptions.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                You have {unconfirmedPrescriptions.length} unconfirmed prescription(s). Please review and confirm them to ensure you are following your treatment plan.
              </AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="unconfirmed">
            <TabsList>
              <TabsTrigger value="unconfirmed">Unconfirmed ({unconfirmedPrescriptions.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({confirmedPrescriptions.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="unconfirmed">
              <PrescriptionTable
                prescriptions={unconfirmedPrescriptions}
                onConfirm={handleConfirmPrescription}
                showConfirmButton={true}
              />
            </TabsContent>
            <TabsContent value="confirmed">
              <PrescriptionTable
                prescriptions={confirmedPrescriptions}
                onConfirm={handleConfirmPrescription}
                showConfirmButton={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface PrescriptionTableProps {
  prescriptions: Prescription[]
  onConfirm: (id: string) => void
  showConfirmButton: boolean
}

function PrescriptionTable({ prescriptions, onConfirm, showConfirmButton }: PrescriptionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Prescribed By</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          {showConfirmButton && <TableHead>Action</TableHead>}
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
              <Badge variant={prescription.confirmed ? "default" : "destructive"}>
                {prescription.confirmed ? "Confirmed" : "Pending"}
              </Badge>
            </TableCell>
            {showConfirmButton && (
              <TableCell>
                <Button 
                  onClick={() => onConfirm(prescription.id)}
                  variant="outline"
                  size="sm"
                >
                  Confirm
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}