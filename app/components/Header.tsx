"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Stethoscope,
  Calendar,
  Pill,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getInitials } from "../utils/initial";

export function Header() {
  const { data: session } = useSession(); // Access session and loading status

  const [isDoctor, setIsDoctor] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    if (session?.user?.userType) {
      setIsDoctor(session.user.userType === "doctor");
      setUsername(session.user.name);
    } else {
      setIsDoctor(false); // Default to false if session is not loaded or userType is not available
    }
  }, [session]);
  const dummyInitials = getInitials(username); // Dummy initials for User

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Stethoscope className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Smart Healthcare
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4 mr-2 inline-block" />
              Dashboard
            </Link>
            {isDoctor && (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/appointments"
              >
                <Calendar className="h-4 w-4 mr-2 inline-block" />
                My Appointments
              </Link>
            )}
            {!isDoctor && (
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="/prescriptions"
              >
                <Pill className="h-4 w-4 mr-2 inline-block" />
                My Prescriptions
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`}
                      alt={username}
                    />
                    <AvatarFallback>{dummyInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {isDoctor ? `Dr. ${username}` : username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {isDoctor ? "Doctor" : "Patient"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
