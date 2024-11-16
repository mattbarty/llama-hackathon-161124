'use client';

import { useUser } from "@/app/contexts/UserContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Briefcase, Book } from "lucide-react";
import { useState } from "react";

export function UserProfile() {
  const user = useUser();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>MB</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Your travel and professional information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">
                  {user.currentLocation}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Book className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Passports</p>
                {user.passports.map((passport, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {passport.country} (Expires: {new Date(passport.expiryDate).getFullYear()})
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Industry Interest</p>
                <p className="text-sm text-muted-foreground">
                  {user.industryInterest}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 