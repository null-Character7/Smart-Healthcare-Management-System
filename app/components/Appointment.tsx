"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

// Mock data for doctors
const doctors = [
  { id: 1, name: "Dr. John Smith", specialty: "Cardiology", avatar: "JS" },
  { id: 2, name: "Dr. Sarah Johnson", specialty: "Pediatrics", avatar: "SJ" },
  { id: 3, name: "Dr. Michael Lee", specialty: "Dermatology", avatar: "ML" },
  { id: 4, name: "Dr. Emily Brown", specialty: "Neurology", avatar: "EB" },
  { id: 5, name: "Dr. David Wilson", specialty: "Orthopedics", avatar: "DW" },
];

// Mock data for specialties
const specialties = [
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Neurology",
  "Orthopedics",
];

// Main Appointment component
export function Appointment({ userType = "doctor" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const filteredDoctors = doctors.filter(
    (doctor) =>
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialty === "all" || selectedSpecialty === "" || doctor.specialty === selectedSpecialty)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {userType === "patient"
          ? "Schedule an Appointment"
          : "Manage Appointments"}
      </h1>

      <Tabs defaultValue={userType === "patient" ? "search" : "upcoming"}>
        <TabsList className="mb-4">
          {userType === "patient" && (
            <TabsTrigger value="search">Search Doctors</TabsTrigger>
          )}
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          {userType === "doctor" && (
            <TabsTrigger value="requests">Appointment Requests</TabsTrigger>
          )}
        </TabsList>

        {userType === "patient" && (
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Find a Doctor</CardTitle>
                <CardDescription>
                  Search for doctors by name or specialty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="search"
                        placeholder="Search by name or specialty"
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select
                      value={selectedSpecialty}
                      onValueChange={setSelectedSpecialty}
                    >
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specialties</SelectItem>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                View your scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <AppointmentList userType={userType} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {userType === "doctor" && (
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Requests</CardTitle>
                <CardDescription>
                  Review and confirm appointment requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <AppointmentRequestList />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

interface Doctor {
  name: string;
  avatar: string;
  specialty: string;
}

// Define the props for the DoctorCard component
interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleBookingSubmit = () => {
    if (selectedDate) {
      console.log(`Booking appointment with ${doctor.name} on ${selectedDate}`);
      // Handle booking logic
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${doctor.name}`}
            alt={doctor.name}
          />
          <AvatarFallback>{doctor.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{doctor.name}</h3>
          <p className="text-sm text-gray-500">{doctor.specialty}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Book Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
              <DialogDescription>
                Select a date and time for your appointment
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                  <SelectItem value="15:00">03:00 PM</SelectItem>
                  <SelectItem value="16:00">04:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleBookingSubmit}>
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  patient: string;
  status: string;
}

interface AppointmentListProps {
  userType: string; // Define userType as either 'doctor' or 'patient', or adjust based on your use case
}

const AppointmentList: React.FC<AppointmentListProps> = ({ userType }) => {
  const appointments: Appointment[] = [
    {
      id: 1,
      date: "2023-10-15",
      time: "10:00 AM",
      doctor: "Dr. John Smith",
      patient: "Jane Doe",
      status: "Confirmed",
    },
    {
      id: 2,
      date: "2023-10-17",
      time: "11:30 AM",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">
                  {appointment.date} at {appointment.time}
                </p>
                <p className="text-sm text-gray-500">
                  {userType === "patient"
                    ? appointment.doctor
                    : appointment.patient}
                </p>
              </div>
              
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AppointmentRequestList = () => {
  // Mock data for appointment requests
  const requests: Appointment[] = [
    {
      id: 1,
      date: "2023-10-18",
      time: "10:00 AM",
      doctor: "Dr. John Smith",
      patient: "John Doe",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">
                  {request.date} at {request.time}
                </p>
                <p className="text-sm text-gray-500">{request.patient}</p>
              </div>
              <Badge variant="secondary">{request.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
