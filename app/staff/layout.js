"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import directus from "@/lib/directus";
import { readItems, updateItem } from "@directus/sdk"

export default function StaffLayout({ children }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [newCalls, setNewCalls] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState('');
  const router = useRouter();

  // Fetch new leads from the server
  const fetchLeads = async () => {
    try {
      // Simulate fetching data (replace with your actual API request)
      const data = await directus.request(readItems("leads"))

     // Filter the leads where `tele_caller` is null or an empty string
     const filteredLeads = data.filter((lead) => !lead.tele_caller)

      // Update the number of new leads
      setNewLeadsCount(filteredLeads.length);
      setNewCalls(filteredLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Refresh new calls every 30 seconds
    const interval = setInterval(() => {
      console.log("Refreshing new calls data...");
      fetchLeads();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle assigning a call to the current staff
  const handleAssignCall = (call) => {
    setNewCalls(newCalls.filter((c) => c.id !== call.id));

    // Show success toast
    toast({
      title: "Call assigned",
      description: `${call.name}'s call has been assigned to you.`,
      variant: "default",
    });

    console.log(`Assigned call ${call.id} to current staff`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });

    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
        <a className="flex items-center gap-2" href="/staff/dashboard">
          <img
            src="https://zeroinfy.in/cdn/shop/files/ZEROINFY_NEW_WEBSITE_LOGO_200x.png?v=1683973607"
            alt="Zeroinfy CRM"
            className="h-10"
          />
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ml-2 bg-gradient-to-r from-pink-500 to-violet-500">
            Team
          </div>
        </a>
          <nav className="ml-auto flex items-center gap-4 md:gap-6">
            <Link
              href="/staff/dashboard"
              className={`text-sm font-medium ${
                pathname === "/staff/dashboard"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/staff/calls"
              className={`text-sm font-medium ${
                pathname.startsWith("/staff/calls")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activities
            </Link>
            <Link
              href="/staff/all-calls"
              className={`text-sm font-medium ${
                pathname.startsWith("/staff/all-calls")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
                  {newLeadsCount == '' ? 0 : newLeadsCount}
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
  );
}
