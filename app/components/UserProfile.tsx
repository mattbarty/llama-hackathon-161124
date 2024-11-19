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
            <CardTitle>Made with ❤️ by <a href="https://www.mattbarty.com/projects" target="_blank" rel="noopener noreferrer" className="underline text-teal-500 hover:text-teal-600 transition-colors duration-300 font-bold">Matt Barty</a></CardTitle>
            <CardDescription>
              Submission for Meta's <a href="https://www.linkedin.com/posts/meta-for-developers_llama-impact-hackathon-london-activity-7263240512374026241-ATpy/" target="_blank" rel="noopener noreferrer" className="underline text-teal-500 hover:text-teal-600 transition-colors duration-300">LLama Impact Hackathon 2024</a>, London
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-bold">Please Note:</p>
            <ul className="list-disc text-sm text-muted-foreground">
              <li>This app was built in 24 hours for the hackathon and is likely laden with bugs,</li>
              <li>Not intended for production use,</li>
              <li>Will break when my free credits run out,</li>
              <li>If it stops working, please contact me on <a href="https://www.linkedin.com/in/matthew-barty/" target="_blank" rel="noopener noreferrer" className="underline text-teal-500 hover:text-teal-600 transition-colors duration-300">LinkedIn</a> and I'll try to fix it,</li>
              <li>Have fun !</li>
            </ul>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 