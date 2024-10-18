"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  FileText,
  Activity,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useSession } from "next-auth/react";
import { format, parseISO } from "date-fns";

interface Prescription {
  medication: string;
  dosage: string;
  doctor: { name: string };
  startDate: string;
  endDate: string;
}

type Doctor = {
  id: number;
  name: string;
  specialty: string;
};

interface Appointment {
  id: number;
  date: string;
  timeSlot: string;
  doctor: Doctor;
  status: string;
}

export function PatientDashboard() {
  const { data: session } = useSession();
  const patientId = session?.user.id;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>();
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;

      setLoading(true);
      try {
        const [appointmentsRes, prescriptionsRes, doctorsRes] = await Promise.all([
          axios.get(`/api/patients/appointments`, { params: { patientId } }),
          axios.get(`/api/patients/prescriptions`, { params: { patientId } }),
          axios.get("/api/doctors")
        ]);

        setAppointments(appointmentsRes.data);
        setPrescriptions(prescriptionsRes.data.filter((p: any) => p.confirmed === true));
        setDoctors(doctorsRes.data.doctors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      doctorId: selectedDoctor?.id,
      patientId: patientId,
      date: selectedDate,
      timeSlot: selectedSlot,
      reason,
    };
    try {
      const response = await fetch("/api/patients/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        console.log("Appointment successfully created");
        // Refresh appointments
        const updatedAppointments = await axios.get(`/api/patients/appointments`, { params: { patientId } });
        setAppointments(updatedAppointments.data);
      } else {
        console.error("Error creating appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="ai-recommendations">Health Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View your upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {loading ? (
                          Array(3).fill(0).map((_, index) => (
                            <AppointmentCardSkeleton key={index} />
                          ))
                        ) : (
                          appointments.map((appointment) => (
                            <AppointmentCard
                              key={appointment.id}
                              time={`${format(parseISO(appointment.date), "MMM d, yyyy")} ${appointment.timeSlot}`}
                              doctorName={appointment.doctor.name}
                              specialty={appointment.doctor.specialty}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Book New Appointment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book New Appointment</DialogTitle>
                      <DialogDescription>
                        Select a doctor and preferred date for your appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="doctor" className="text-right">
                          Doctor
                        </Label>
                        <Select
                          value={selectedDoctor ? `dr-${selectedDoctor.name.toLowerCase().replace(/\s+/g, "-")}` : undefined}
                          onValueChange={(value) => {
                            const selected = doctors.find(
                              (doctor) => `dr-${doctor.name.toLowerCase().replace(/\s+/g, "-")}` === value
                            );
                            setSelectedDoctor(selected);
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            {doctors.map((doctor) => (
                              <SelectItem
                                key={doctor.id}
                                value={`dr-${doctor.name.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                {doctor.name} ({doctor.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Preferred Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          className="col-span-3"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Time Slot</Label>
                        <div className="col-span-3">
                          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                            <div className="grid grid-cols-3 gap-2">
                              {timeSlots.map((slot) => (
                                <Button
                                  key={slot}
                                  variant={selectedSlot === slot ? "default" : "outline"}
                                  onClick={() => setSelectedSlot(slot)}
                                  className="w-full"
                                >
                                  {slot}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                          Reason for Visit
                        </Label>
                        <Input
                          id="reason"
                          className="col-span-3"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={bookAppointment}>
                        Book Appointment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>View your current and past prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array(3).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      prescriptions.map((prescription) => (
                        <TableRow key={prescription.medication}>
                          <TableCell>{prescription.medication}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.doctor.name}</TableCell>
                          <TableCell>{new Date(prescription.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {prescription.endDate
                              ? new Date(prescription.endDate).toLocaleDateString()
                              : "Ongoing"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-recommendations">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Health Insights</CardTitle>
                <CardDescription>Personalized health recommendations based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">Exercise Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      Based on your recent activity levels, we recommend increasing your daily step count to 10,000 steps. This can help improve your cardiovascular health and overall fitness.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Dietary Suggestion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      Your recent blood work shows slightly elevated cholesterol levels. Consider incorporating more omega-3 rich foods like fish, flaxseeds, and walnuts into your diet.
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-yellow-600 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Health Warning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Your blood pressure readings have been consistently high over the past month. Please schedule an appointment with your doctor to discuss potential treatments or lifestyle changes.
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Health Data</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AppointmentCard({
  time,
  doctorName,
  specialty,
}: {
  time: string;
  doctorName: string;
  specialty: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${doctorName}`}
            alt={doctorName}
          />
          <AvatarFallback>
            {doctorName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{time}</p>
          
          <p>{doctorName}</p>
          <p className="text-sm text-gray-500">{specialty}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardContent>
    </Card>
  );
}