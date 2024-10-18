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
import { Skeleton } from "@/components/ui/skeleton"
import { format, parseISO } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

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
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  const patientId = session?.user.id

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) return

      setLoading(true)
      try {
        const response = await axios.get(`/api/patients/prescriptions`, {
          params: { patientId },
        })
        const formattedPrescriptions = response.data.map((prescription: any) => ({
          id: prescription.id,
          medication: prescription.medication,
          dosage: prescription.dosage,
          prescribedBy: prescription.doctor.name,
          startDate: prescription.startDate,
          endDate: prescription.endDate,
          confirmed: prescription.confirmed,
        }))
        setPrescriptions(formattedPrescriptions)
      } catch (error: any) {
        console.error("Error fetching prescriptions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrescriptions()
  }, [patientId])

  const handleConfirmPrescription = async (id: string) => {
    try {
      await axios.put('/api/patients/prescriptions', { id })
      setPrescriptions(prevPrescriptions =>
        prevPrescriptions.map(prescription =>
          prescription.id === id ? { ...prescription, confirmed: true } : prescription
        )
      )
    } catch (error) {
      console.error('Error confirming prescription:', error)
    }
  }

  const confirmedPrescriptions = prescriptions.filter(p => p.confirmed)
  const unconfirmedPrescriptions = prescriptions.filter(p => !p.confirmed)

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
          <CardDescription>Review and confirm your current prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && unconfirmedPrescriptions.length > 0 && (
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
              <TabsTrigger value="unconfirmed">
                Unconfirmed ({loading ? '...' : unconfirmedPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({loading ? '...' : confirmedPrescriptions.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="unconfirmed">
              <PrescriptionTable
                prescriptions={unconfirmedPrescriptions}
                onConfirm={handleConfirmPrescription}
                showConfirmButton={true}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="confirmed">
              <PrescriptionTable
                prescriptions={confirmedPrescriptions}
                onConfirm={handleConfirmPrescription}
                showConfirmButton={false}
                loading={loading}
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
  loading: boolean
}

function PrescriptionTable({ prescriptions, onConfirm, showConfirmButton, loading }: PrescriptionTableProps) {
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
        {loading ? (
          Array(5).fill(0).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              {showConfirmButton && (
                <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
              )}
            </TableRow>
          ))
        ) : (
          prescriptions.map((prescription) => (
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
          ))
        )}
      </TableBody>
    </Table>
  )
}