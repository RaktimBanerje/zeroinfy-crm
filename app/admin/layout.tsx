"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart, Bell, FileText, Home, LogOut, Phone, Plus, Settings, Tag, Upload, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { initializeData } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    // Initialize data in localStorage
    initializeData()

    // Check if user is logged in and is admin
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userType = localStorage.getItem("userType")
    const storedUserName = localStorage.getItem("userName")

    if (!isLoggedIn || userType !== "admin") {
      router.push("/login")
    } else {
      setUserName(storedUserName || "Admin")
    }
  }, [router])

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

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "Leads", href: "/admin/activities", icon: Phone },
    { name: "Customers", href: "/admin/customers", icon: Users },
    // { name: "Calls", href: "/admin/calls", icon: Phone },
    // { name: "Tasks", href: "/admin/tasks", icon: FileText },
    // { name: "Reports", href: "/admin/reports", icon: BarChart },
    {
      name: "Management",
      href: "#",
      icon: Settings,
      children: [
        { name: "Users", href: "/admin/users", icon: User },
        { name: "Tags", href: "/admin/tags", icon: Tag },
        { name: "Sources", href: "/admin/sources", icon: FileText },
        { name: "Followup Levels", href: "/admin/followup-levels", icon: FileText },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-1">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Zeroinfy CRM
            </h1>
            <Badge className="ml-2 bg-gradient-to-r from-pink-500 to-violet-500">Admin</Badge>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* <Button variant="outline" className="relative" size="icon">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
              3
            </span>
          </Button> */}

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-pink-500">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                    {userName.substring(0, 2).toUpperCase()}
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
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-background to-muted/50">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left">Zeroinfy CRM</SheetTitle>
            <SheetDescription className="text-left">Admin Dashboard</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-2">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          pathname === child.href
                            ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-auto">
            <Separator className="my-4" />
            <div className="flex items-center gap-2 px-3 py-2">
              <Avatar className="h-8 w-8 border-2 border-pink-500">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {navigation.map((item) =>
                  item.children ? (
                    <div key={item.name} className="space-y-2 my-2">
                      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground">
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              pathname === child.href
                                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <child.icon className="h-4 w-4" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 my-1 text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  ),
                )}
              </nav>
            </div>
            <div className="mt-auto p-4">
              <div className="flex items-center gap-2 rounded-lg border bg-background p-4">
                <Avatar className="h-8 w-8 border-2 border-pink-500">
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                    {userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function Menu({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

