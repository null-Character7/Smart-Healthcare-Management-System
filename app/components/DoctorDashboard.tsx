"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, ClipboardList, FileText, Activity, Search, Plus } from 'lucide-react'

export function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a
            href="#appointments"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100"
          >
            <CalendarDays className="w-5 h-5 mr-2" />
            Appointments
          </a>
          <a
            href="#patients"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Patient Records
          </a>
          <a
            href="#prescriptions"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100"
          >
            <FileText className="w-5 h-5 mr-2" />
            Prescriptions
          </a>
          <a
            href="#ai-tool"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100"
          >
            <Activity className="w-5 h-5 mr-2" />
            AI Prediction Tool
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patient Records</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="ai-tool">AI Prediction Tool</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
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
                    <h3 className="text-lg font-semibold mb-2">Appointments for {date?.toDateString()}</h3>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        <AppointmentCard
                          time="09:00 AM"
                          patientName="John Doe"
                          reason="Annual Checkup"
                        />
                        <AppointmentCard
                          time="10:30 AM"
                          patientName="Jane Smith"
                          reason="Follow-up"
                        />
                        <AppointmentCard
                          time="02:00 PM"
                          patientName="Bob Johnson"
                          reason="New Patient Consultation"
                        />
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Appointment
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Patient Records Tab */}
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Doe</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>2023-05-15</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Record</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>32</TableCell>
                      <TableCell>2023-06-02</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Record</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Bob Johnson</TableCell>
                      <TableCell>58</TableCell>
                      <TableCell>2023-06-10</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Record</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescriptions Tab */}
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Amoxicillin</TableCell>
                      <TableCell>500mg, 3x daily</TableCell>
                      <TableCell>2023-06-10</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Lisinopril</TableCell>
                      <TableCell>10mg, 1x daily</TableCell>
                      <TableCell>2023-06-02</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      New Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write New Prescription</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new prescription.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="patient" className="text-right">
                          Patient
                        </Label>
                        <Input id="patient" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="medication" className="text-right">
                          Medication
                        </Label>
                        <Input id="medication" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dosage" className="text-right">
                          Dosage
                        </Label>
                        <Input id="dosage" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instructions" className="text-right">
                          Instructions
                        </Label>
                        <Textarea id="instructions" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI Prediction Tool Tab */}
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
  )
}

function AppointmentCard({ time, patientName, reason }: { time: string; patientName: string; reason: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${patientName}`} alt={patientName} />
          <AvatarFallback>{patientName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{time}</p>
          <p>{patientName}</p>
          <p className="text-sm text-gray-500">{reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}