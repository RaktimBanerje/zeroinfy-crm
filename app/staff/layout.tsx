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
              Calls
            </Link>
            <Button variant="outline" asChild>
              <Link href="/staff/new-calls" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                New Calls
              </Link>
            </Button>
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

