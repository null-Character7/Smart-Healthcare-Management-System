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
import { CalendarDays, FileText, Activity, Plus, AlertTriangle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PatientDashboard() {
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
            href="#prescriptions"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100"
          >
            <FileText className="w-5 h-5 mr-2" />
            Prescriptions
          </a>
          <a
            href="#ai-recommendations"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100"
          >
            <Activity className="w-5 h-5 mr-2" />
            Health Insights
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="ai-recommendations">Health Insights</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>View your upcoming and past appointments</CardDescription>
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
                          doctorName="Dr. Smith"
                          specialty="General Practitioner"
                          status="Upcoming"
                        />
                        <AppointmentCard
                          time="02:30 PM"
                          doctorName="Dr. Johnson"
                          specialty="Cardiologist"
                          status="Upcoming"
                        />
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
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a doctor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-smith">Dr. Smith (General Practitioner)</SelectItem>
                            <SelectItem value="dr-johnson">Dr. Johnson (Cardiologist)</SelectItem>
                            <SelectItem value="dr-lee">Dr. Lee (Dermatologist)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Preferred Date
                        </Label>
                        <Input id="date" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">
                          Reason for Visit
                        </Label>
                        <Input id="reason" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Book Appointment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>


          {/* Prescriptions Tab */}
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
                    <TableRow>
                      <TableCell>Amoxicillin</TableCell>
                      <TableCell>500mg, 3x daily</TableCell>
                      <TableCell>Dr. Smith</TableCell>
                      <TableCell>2023-06-10</TableCell>
                      <TableCell>2023-06-20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lisinopril</TableCell>
                      <TableCell>10mg, 1x daily</TableCell>
                      <TableCell>Dr. Johnson</TableCell>
                      <TableCell>2023-05-15</TableCell>
                      <TableCell>Ongoing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ibuprofen</TableCell>
                      <TableCell>400mg, as needed</TableCell>
                      <TableCell>Dr. Lee</TableCell>
                      <TableCell>2023-04-01</TableCell>
                      <TableCell>2023-04-14</TableCell>
                    </TableRow>
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
                      <DialogDescription>
                        Add prescription details
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="doctor" className="text-right">
                          Prescribed by
                        </Label>
                        <Input id="doctor" className="col-span-3" />
                        <Label htmlFor="medication" className="text-right">
                          Medication
                        </Label>
                        <Input id="medication" className="col-span-3" />
                        <Label htmlFor="dosage" className="text-right">
                          Dosage
                        </Label>
                        <Input id="dosage" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Start Date
                        </Label>
                        <Input id="date" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          End Date
                        </Label>
                        <Input id="date" type="date" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI-based Health Recommendations Tab */}
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
  )
}

function AppointmentCard({ time, doctorName, specialty, status }: { time: string; doctorName: string; specialty: string; status: 'Upcoming' | 'Past' }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${doctorName}`} alt={doctorName} />
          <AvatarFallback>{doctorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{time}</p>
          <p>{doctorName}</p>
          <p className="text-sm text-gray-500">{specialty}</p>
          <p className={`text-sm ${status === 'Upcoming' ? 'text-green-500' : 'text-gray-500'}`}>{status}</p>
        </div>
      </CardContent>
    </Card>
  )
}