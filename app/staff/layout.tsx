"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Dummy data for new calls
const newCallsData = [
  {
    id: "call1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@gmail.com",
    query: "Interested in CA Final course. Wants to know about the fee structure and study materials.",
    source: "Website",
    timestamp: "10 minutes ago",
    tags: ["CA Final", "Fee Structure"],
  },
  {
    id: "call2",
    name: "Priya Patel",
    phone: "+91 87654 32109",
    email: "priya.patel@outlook.com",
    query: "Looking for CA Inter coaching. Has questions about the batch timings and faculty.",
    source: "Referral",
    timestamp: "25 minutes ago",
    tags: ["CA Inter", "Batch Timing"],
  },
  {
    id: "call3",
    name: "Amit Kumar",
    phone: "+91 76543 21098",
    email: "amit.kumar@yahoo.com",
    query: "Wants to enroll for CA Foundation. Needs scholarship information and payment options.",
    source: "Social Media",
    timestamp: "45 minutes ago",
    tags: ["CA Foundation", "Scholarship"],
  },
  {
    id: "call4",
    name: "Sneha Gupta",
    phone: "+91 65432 10987",
    email: "sneha.gupta@gmail.com",
    query:
      "Interested in switching from another coaching institute. Wants to know the process and if any credits can be transferred.",
    source: "Phone Inquiry",
    timestamp: "1 hour ago",
    tags: ["CA Final", "Transfer"],
  },
]

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { toast } = useToast()
  const [newCalls, setNewCalls] = useState(newCallsData)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // Refresh new calls every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from an API
      console.log("Refreshing new calls data...")
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Handle assigning a call to the current staff
  const handleAssignCall = (call) => {
    // Remove the call from the list
    setNewCalls(newCalls.filter((c) => c.id !== call.id))

    // Show success toast
    toast({
      title: "Call assigned",
      description: `${call.name}'s call has been assigned to you.`,
      variant: "default",
    })

    // In a real app, this would update the database
    console.log(`Assigned call ${call.id} to current staff`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Link href="/staff/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-primary">Zeroinfy</span>
            <span className="text-sm text-muted-foreground">Staff Portal</span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            <Link
              href="/staff/dashboard"
              className={`text-sm font-medium ${
                pathname === "/staff/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/staff/calls"
              className={`text-sm font-medium ${
                pathname.startsWith("/staff/calls") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activities
            </Link>
            <Link
              href="/staff/all-calls"
              className={`text-sm font-medium ${
                pathname.startsWith("/staff/all-calls") ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Leads
            </Link>
            <Button variant="outline" asChild>
            
            <Link
              href="/staff/new-calls"
              className="relative flex items-center gap-2 px-4 py-2 w-[180px] rounded-lg text-white transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient hover:scale-105"
            >
              <Phone className="h-4 w-4" />
              New Leads

              {/* Badge */}
              <span
                style={{ right: 12, top: 8 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-black animate-pulse"
              >
                10
              </span>
            </Link>
          </Button>

<style jsx>{`
  /* Rainbow gradient animation */
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient {
    background-size: 400% 400%;
    animation: gradientAnimation 3s ease infinite;
  }

  /* Glowing effect on hover */
  .hover\:scale-105:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.6);
  }

  /* Pulse animation for badge */
  .animate-pulse {
    animation: pulse 1.5s infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`}</style>
            <Avatar className="h-8 w-8">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

