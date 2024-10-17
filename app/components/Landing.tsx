"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrainCircuit, CalendarCheck, Pill, Stethoscope } from "lucide-react"
import { useRouter } from 'next/navigation'

export function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Stethoscope className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                Smart Healthcare
              </span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#about">About</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#services">Services</a>
              <a className="transition-colors hover:text-foreground/80 text-foreground/60" href="#contact">Contact</a>
            </nav>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-controls="radix-:R1mcq:"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M3 5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 12H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 19H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </button>
          {isMenuOpen && (
            <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
              <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
                <a className="flex items-center space-x-2" href="/">
                  <Stethoscope className="h-6 w-6" />
                  <span className="font-bold">Smart Healthcare</span>
                </a>
                <nav className="grid grid-flow-row auto-rows-max text-sm">
                  <a
                    className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                    href="#about"
                  >
                    About
                  </a>
                  <a
                    className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                    href="#services"
                  >
                    Services
                  </a>
                  <a
                    className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                    href="#contact"
                  >
                    Contact
                  </a>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Smart Healthcare Management System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamlining healthcare interactions for doctors, patients, and pharmacies with AI-powered solutions.
                </p>
              </div>
              <div className="space-x-4">
              <Button onClick={() => router.push("/auth/signin")}>Get Started</Button>
              <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
            <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
              The Smart Healthcare Management System is a cutting-edge platform that leverages AI, ML, and IoT
              technologies to revolutionize healthcare delivery. Our mission is to create a seamless, efficient, and
              intelligent ecosystem for managing appointments, prescriptions, medical records, and patient monitoring.
            </p>
          </div>
        </section>
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Our Services</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <CalendarCheck className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Appointment Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Effortlessly schedule and manage appointments with our intuitive system.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Pill className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Prescription Handling</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Securely manage and track prescriptions for patients and pharmacies.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BrainCircuit className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">AI-Powered Diagnostics</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Utilize advanced AI to predict diseases based on symptoms and health data.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Contact Us</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Have questions or need support? Reach out to us using the contact information below or fill out the form.
                </p>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    +1 (555) 123-4567
                  </p>
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    support@smarthealthcare.com
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="message"
                    placeholder="Your message here..."
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-800 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-white">Our Story</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Team</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Careers</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Services</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-white">For Patients</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">For Doctors</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">For Pharmacies</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-white">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-white">Facebook</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">Twitter</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p>© 2024 Smart Healthcare Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}