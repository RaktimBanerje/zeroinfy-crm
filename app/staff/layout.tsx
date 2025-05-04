"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarImage } from "@radix-ui/react-avatar"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userType")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })

    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <a className="flex items-center gap-2" href="/staff/dashboard"><div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone h-5 w-5 text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Zeroinfy CRM</h1><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-2 bg-gradient-to-r from-pink-500 to-violet-500">Staff</div></a>
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
              Customers
            </Link>
            <Button variant="outline" asChild>
            
            <Link
              href="/staff/new-calls"
              className="relative flex items-center gap-2 px-4 py-2 w-[180px] rounded-lg text-white transition-all bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient hover:scale-105"
            >
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-pink-500">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                    {"A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

