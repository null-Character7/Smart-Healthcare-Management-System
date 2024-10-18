"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  reason: string;
  confirmed: boolean;
  patient: {
    id: string;
    name: string;
    email: string;
    age: string;
  };
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const doctorId = session?.user.id;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return;

      setLoading(true);
      try {
        const response = await axios.get(`/api/doctors/appointments/all`, {
          params: { doctorId },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleConfirmAppointment = async (id: string) => {
    try {
      await axios.put('/api/doctors/appointments', { id });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id ? { ...appointment, confirmed: true } : appointment
        )
      );
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.confirmed === false
  );
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.confirmed === true
  );

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
              <TabsTrigger value="pending">
                Pending ({loading ? '...' : pendingAppointments.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Confirmed ({loading ? '...' : confirmedAppointments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <AppointmentTable
                appointments={pendingAppointments}
                onConfirm={handleConfirmAppointment}
                showActions={true}
                loading={loading}
              />
            </TabsContent>
            <TabsContent value="upcoming">
              <AppointmentTable
                appointments={confirmedAppointments}
                onConfirm={handleConfirmAppointment}
                showActions={false}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface AppointmentTableProps {
  appointments: Appointment[];
  onConfirm: (id: string) => void;
  showActions: boolean;
  loading: boolean;
}

function AppointmentTable({
  appointments,
  onConfirm,
  showActions,
  loading,
}: AppointmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time Slot</TableHead>
          <TableHead>Patient Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array(5).fill(0).map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              {showActions && (
                <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
              )}
            </TableRow>
          ))
        ) : (
          appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                {format(parseISO(appointment.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{appointment.timeSlot}</TableCell>
              <TableCell>{appointment.patient.name}</TableCell>
              <TableCell>{appointment.patient.age}</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>
                <Badge variant={appointment.confirmed ? "default" : "outline"}>
                  {appointment.confirmed ? "Confirmed" : "Pending"}
                </Badge>
              </TableCell>
              {showActions && (
                <TableCell>
                  {!appointment.confirmed && (
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
          ))
        )}
      </TableBody>
    </Table>
  );
}