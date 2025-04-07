"use client"

import { useState, useEffect } from "react"
import { Bell, ChevronDown, Download, Filter, LogOut, Plus, Search, Settings, Upload, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the dashboard
const kpiData = {
  assignedCalls: 42,
  pendingCalls: 18,
  completedCalls: 76,
}

const tabData = [
  { id: "first-order", label: "First Order", count: 24 },
  { id: "second-order", label: "Second Order", count: 18 },
  { id: "third-order", label: "Third Order", count: 12 },
  { id: "fourth-order", label: "Fourth Order", count: 8 },
]

const callData = [
  {
    id: 1,
    customerName: "John Smith",
    phoneNumber: "+1 (555) 123-4567",
    email: "john.smith@example.com",
    query: "Interested in Data Science course",
    status: "New",
    source: "Website",
    followUpLevel: 1,
    tags: ["Data Science", "Spring Term", "Engineering"],
    order: "first-order",
  },
  {
    id: 2,
    customerName: "Emily Johnson",
    phoneNumber: "+1 (555) 234-5678",
    email: "emily.johnson@example.com",
    query: "Information about MBA program",
    status: "In Progress",
    source: "Referral",
    followUpLevel: 2,
    tags: ["MBA", "Fall Term", "Business"],
    order: "second-order",
  },
  {
    id: 3,
    customerName: "Michael Brown",
    phoneNumber: "+1 (555) 345-6789",
    email: "michael.brown@example.com",
    query: "Pricing for Computer Science degree",
    status: "Closed",
    source: "Social Media",
    followUpLevel: 4,
    tags: ["Computer Science", "Fall Term", "Engineering"],
    order: "fourth-order",
  },
  {
    id: 4,
    customerName: "Sarah Davis",
    phoneNumber: "+1 (555) 456-7890",
    email: "sarah.davis@example.com",
    query: "Application deadline for Psychology program",
    status: "Sold",
    source: "Email Campaign",
    followUpLevel: 3,
    tags: ["Psychology", "Winter Term", "Arts"],
    order: "third-order",
  },
  {
    id: 5,
    customerName: "David Wilson",
    phoneNumber: "+1 (555) 567-8901",
    email: "david.wilson@example.com",
    query: "Scholarship opportunities for Engineering",
    status: "New",
    source: "Phone Inquiry",
    followUpLevel: 1,
    tags: ["Engineering", "Spring Term", "Scholarship"],
    order: "first-order",
  },
  {
    id: 6,
    customerName: "Jennifer Lee",
    phoneNumber: "+1 (555) 678-9012",
    email: "jennifer.lee@example.com",
    query: "Transfer credits for Business Administration",
    status: "In Progress",
    source: "Website",
    followUpLevel: 2,
    tags: ["Business Administration", "Summer Term", "Transfer"],
    order: "second-order",
  },
]

const followUpTasks = [
  {
    id: 1,
    customerName: "John Smith",
    query: "Interested in Data Science course",
    deadline: "2023-06-15",
    priority: "High",
  },
  {
    id: 2,
    customerName: "Emily Johnson",
    query: "Information about MBA program",
    deadline: "2023-06-18",
    priority: "Medium",
  },
  {
    id: 3,
    customerName: "David Wilson",
    query: "Scholarship opportunities for Engineering",
    deadline: "2023-06-20",
    priority: "Low",
  },
]

const chartData = [
  { name: "Mon", calls: 12 },
  { name: "Tue", calls: 19 },
  { name: "Wed", calls: 15 },
  { name: "Thu", calls: 22 },
  { name: "Fri", calls: 18 },
  { name: "Sat", calls: 8 },
  { name: "Sun", calls: 5 },
]

const newCalls = [
  {
    id: 101,
    customerName: "Alex Thompson",
    phoneNumber: "+1 (555) 987-6543",
    time: "5 minutes ago",
  },
  {
    id: 102,
    customerName: "Maria Garcia",
    phoneNumber: "+1 (555) 876-5432",
    time: "12 minutes ago",
  },
  {
    id: 103,
    customerName: "Robert Chen",
    phoneNumber: "+1 (555) 765-4321",
    time: "25 minutes ago",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("first-order")
  const [filteredCalls, setFilteredCalls] = useState(callData)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showNewCalls, setShowNewCalls] = useState(false)
  const [chartTimeframe, setChartTimeframe] = useState("week")
  const [showCallTable, setShowCallTable] = useState(false)
  const [selectedCall, setSelectedCall] = useState(null)

  // Filter calls based on active tab, search query, and status filter
  useEffect(() => {
    let filtered = callData.filter((call) => call.order === activeTab)

    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.phoneNumber.includes(searchQuery) || call.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((call) => call.status === statusFilter)
    }

    setFilteredCalls(filtered)
  }, [activeTab, searchQuery, statusFilter])

  // Handle KPI card click
  const handleKpiCardClick = (type) => {
    setShowCallTable(true)

    // Filter calls based on the KPI card clicked
    if (type === "assigned") {
      setStatusFilter("New")
    } else if (type === "pending") {
      setStatusFilter("In Progress")
    } else if (type === "completed") {
      setStatusFilter("Closed")
    }
  }

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Closed":
        return "bg-green-100 text-green-800"
      case "Sold":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-orange-600"
      case "Low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">CRM Staff Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* New Calls Button */}
          <Button variant="outline" className="relative" onClick={() => setShowNewCalls(!showNewCalls)}>
            <Bell className="mr-2 h-4 w-4" />
            New Calls
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {newCalls.length}
            </span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* New Calls Sheet */}
      <Sheet open={showNewCalls} onOpenChange={setShowNewCalls}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Calls</SheetTitle>
            <SheetDescription>Recently added calls that require your attention.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {newCalls.map((call) => (
              <div key={call.id} className="flex items-start justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">{call.customerName}</h3>
                  <p className="text-sm text-muted-foreground">{call.phoneNumber}</p>
                  <p className="text-xs text-muted-foreground">{call.time}</p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 space-y-6 p-6">
        {!showCallTable ? (
          <>
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleKpiCardClick("assigned")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Assigned Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpiData.assignedCalls}</div>
                  <p className="text-xs text-muted-foreground">+5% from last week</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleKpiCardClick("pending")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpiData.pendingCalls}</div>
                  <p className="text-xs text-muted-foreground">-2% from last week</p>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleKpiCardClick("completed")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpiData.completedCalls}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Graph Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Call Statistics</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartTimeframe === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartTimeframe("week")}
                  >
                    This Week
                  </Button>
                  <Button
                    variant={chartTimeframe === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartTimeframe("month")}
                  >
                    This Month
                  </Button>
                  <Button
                    variant={chartTimeframe === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartTimeframe("all")}
                  >
                    All Time
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tabs and Call Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Call Management</CardTitle>
                <CardDescription>View and manage customer calls by order stage.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="first-order" onValueChange={handleTabChange}>
                  <TabsList className="mb-4 grid w-full grid-cols-4">
                    {tabData.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id} className="relative">
                        {tab.label}
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {tab.count}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {tabData.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search by phone or email..."
                            className="w-full md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter("New")}>New</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatusFilter("Sold")}>Sold</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Bulk Upload
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer Name</TableHead>
                              <TableHead>Phone Number</TableHead>
                              <TableHead className="hidden md:table-cell">Email</TableHead>
                              <TableHead className="hidden md:table-cell">Query</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="hidden md:table-cell">Source</TableHead>
                              <TableHead>Follow-up</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCalls.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center">
                                  No calls found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredCalls.map((call) => (
                                <TableRow key={call.id}>
                                  <TableCell className="font-medium">{call.customerName}</TableCell>
                                  <TableCell>{call.phoneNumber}</TableCell>
                                  <TableCell className="hidden md:table-cell">{call.email}</TableCell>
                                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                    {call.query}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">{call.source}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">Level {call.followUpLevel}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Add Call Synopsis</DialogTitle>
                                            <DialogDescription>
                                              Add notes and update the status for this call.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                              <Label htmlFor="customer">Customer</Label>
                                              <Input id="customer" value={call.customerName} disabled />
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="notes">Notes</Label>
                                              <Textarea id="notes" placeholder="Enter call notes..." />
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="status">Status</Label>
                                              <Select defaultValue={call.status}>
                                                <SelectTrigger id="status">
                                                  <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="New">New</SelectItem>
                                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                                  <SelectItem value="Closed">Closed</SelectItem>
                                                  <SelectItem value="Sold">Sold</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="grid gap-2">
                                              <Label htmlFor="followup">Follow-up Level</Label>
                                              <Select defaultValue={call.followUpLevel.toString()}>
                                                <SelectTrigger id="followup">
                                                  <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="1">Level 1</SelectItem>
                                                  <SelectItem value="2">Level 2</SelectItem>
                                                  <SelectItem value="3">Level 3</SelectItem>
                                                  <SelectItem value="4">Level 4</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </div>
                                          <DialogFooter>
                                            <Button type="submit">Save Changes</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ChevronDown className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem>View Details</DropdownMenuItem>
                                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                                          <DropdownMenuItem>Add to Tasks</DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Follow-Up Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Follow-Up Tasks</CardTitle>
                <CardDescription>Manage your assigned follow-up tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Query</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {followUpTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.customerName}</TableCell>
                          <TableCell>{task.query}</TableCell>
                          <TableCell>{task.deadline}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                          </TableCell>
                          <TableCell>
                            <Button size="sm">Mark as Completed</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Call Table Page */}
            <div className="mb-4">
              <Button variant="outline" onClick={() => setShowCallTable(false)}>
                Back to Dashboard
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Call Details</CardTitle>
                <CardDescription>
                  {statusFilter === "New"
                    ? "Assigned Calls"
                    : statusFilter === "In Progress"
                      ? "Pending Calls"
                      : "Completed Calls"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by phone or email..."
                      className="w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("New")}>New</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Sold")}>Sold</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Bulk Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Query</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Follow-up</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCalls.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No calls found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCalls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell className="font-medium">{call.customerName}</TableCell>
                            <TableCell>{call.phoneNumber}</TableCell>
                            <TableCell>{call.email}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{call.query}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                            </TableCell>
                            <TableCell>{call.source}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Level {call.followUpLevel}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Add Call Synopsis</DialogTitle>
                                      <DialogDescription>
                                        Add notes and update the status for this call.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="customer">Customer</Label>
                                        <Input id="customer" value={call.customerName} disabled />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea id="notes" placeholder="Enter call notes..." />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select defaultValue={call.status}>
                                          <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                            <SelectItem value="Sold">Sold</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="followup">Follow-up Level</Label>
                                        <Select defaultValue={call.followUpLevel.toString()}>
                                          <SelectTrigger id="followup">
                                            <SelectValue placeholder="Select level" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1">Level 1</SelectItem>
                                            <SelectItem value="2">Level 2</SelectItem>
                                            <SelectItem value="3">Level 3</SelectItem>
                                            <SelectItem value="4">Level 4</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit">Save Changes</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                                    <DropdownMenuItem>Add to Tasks</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

