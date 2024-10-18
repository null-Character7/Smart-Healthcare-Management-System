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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Activity,
  Search,
  Plus,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  patient: {
    name: string;
  };
  medication: string;
  dosage: string;
  startDate: string;
  nextVisit: string;
}

interface Appointment {
  id: string;
  patient: {
    name: string;
    age: number;
  };
  date: string;
  reason: string;
  slot: string;
}

type Patient = {
  id: number;
  name: string;
};

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [curAppointments, setCurAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const doctorId = session?.user.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!doctorId) return;

      setLoading(true);
      try {
        const [patientsRes, prescriptionsRes, appointmentsRes] = await Promise.all([
          fetch("/api/patients"),
          axios.get(`/api/doctors/prescriptions`, { params: { doctorId } }),
          axios.get(`/api/doctors/appointments/all`, { params: { doctorId } })
        ]);

        const patientsData = await patientsRes.json();
        setPatients(patientsData.patients);
        setPrescriptions(prescriptionsRes.data.filter((prescription: any) => prescription.confirmed === true));
        setAppointments(appointmentsRes.data.filter((appointment: any) => appointment.confirmed === true));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  useEffect(() => {
    const fetchAppointmentsDate = async () => {
      if (doctorId && date) {
        const formattedDate = format(date, 'yyyy-MM-dd');
        try {
          const response = await fetch(`/api/doctors/appointments?doctorId=${doctorId}&date=${formattedDate}`);
          const data = await response.json();
          setCurAppointments(data);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };
    fetchAppointmentsDate();
  }, [date, doctorId]);

  const savePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    const prescriptionData = {
      patientId: selectedPatient?.id,
      doctorId: doctorId,
      medication,
      dosage,
      startDate,
      endDate,
    };
    try {
      const response = await fetch("/api/doctors/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });
      if (response.ok) {
        console.log("Prescription successfully added");
        // Refresh prescriptions
        const updatedPrescriptions = await axios.get(`/api/doctors/prescriptions`, { params: { doctorId } });
        setPrescriptions(updatedPrescriptions.data.filter((prescription: any) => prescription.confirmed === true));
      } else {
        console.error("Error adding prescription");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="ai-tool">AI Prediction Tool</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View and manage your appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="w-1/2">
                    <h3 className="text-lg font-semibold mb-2">
                      Appointments for {date?.toDateString()}
                    </h3>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {loading ? (
                          Array(3).fill(0).map((_, index) => (
                            <AppointmentCardSkeleton key={index} />
                          ))
                        ) : curAppointments.length > 0 ? (
                          curAppointments.map((appointment) => (
                            <AppointmentCard
                              key={appointment.id}
                              time={appointment.slot}
                              patientName={appointment.patient.name}
                              reason={appointment.reason || "Consultation"}
                            />
                          ))
                        ) : (
                          <p>No appointments for this date.</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>View and manage patient medical records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="search-patients">Search Patients</Label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="text" id="search-patients" placeholder="Enter patient name" />
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array(5).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      appointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{appointment.patient.name}</TableCell>
                          <TableCell>{appointment.patient.age}</TableCell>
                          <TableCell>{format(parseISO(appointment.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescriptions</CardTitle>
                <CardDescription>Write and manage prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="search-prescriptions">Search Prescriptions</Label>
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Input type="text" id="search-prescriptions" placeholder="Enter patient name or medication" />
                    <Button type="submit">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Date Prescribed</TableHead>
                      <TableHead>Next Visit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array(5).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      prescriptions.map((prescription, index) => (
                        <TableRow key={index}>
                          <TableCell>{prescription.patient.name}</TableCell>
                          <TableCell>{prescription.medication}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{format(parseISO(prescription.startDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(parseISO(prescription.nextVisit), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Prescription</DialogTitle>
                      <DialogDescription>Add prescription details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patient" className="text-right">Prescribed to</Label>
                        <Select
                          value={selectedPatient ? selectedPatient.name : undefined}
                          onValueChange={(value) => {
                            const selected = patients.find((patient) => patient.name === value);
                            setSelectedPatient(selected || null);
                          }}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.name}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Label htmlFor="medication" className="text-right">Medication</Label>
                        <Input
                          id="medication"
                          className="col-span-3"
                          value={medication}
                          onChange={(e) => setMedication(e.target.value)}
                        />
                        <Label htmlFor="dosage" className="text-right">Dosage</Label>
                        <Input
                          id="dosage"
                          className="col-span-3"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="startDate" className="text-right">Start Date</Label>
                        <Input
                
                          id="startDate"
                          type="date"
                          className="col-span-3"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endDate" className="text-right">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          className="col-span-3"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={savePrescription}>Add Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="ai-tool">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Disease Prediction Tool</CardTitle>
                <CardDescription>Use AI to predict potential diseases based on symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patient-name">Patient Name</Label>
                    <Input id="patient-name" placeholder="Enter patient name" />
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea id="symptoms" placeholder="Enter patient symptoms (comma-separated)" />
                  </div>
                  <div>
                    <Label>Additional Factors</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="Enter patient age" />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select id="gender" className="w-full p-2 border rounded">
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Run AI Prediction</Button>
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
  patientName,
  reason,
}: {
  time: string;
  patientName: string;
  reason: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${patientName}`}
            alt={patientName}
          />
          <AvatarFallback>
            {patientName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{time}</p>
          <p>{patientName}</p>
          <p className="text-sm text-gray-500">{reason}</p>
        </div>
        <Button variant="outline" size="icon" title="Mark as done">
          <Check className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function AppointmentCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </CardContent>
    </Card>
  );
}