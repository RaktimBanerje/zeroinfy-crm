"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Filter, Plus, Search, Upload, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { type Customer, getDashboardStats, getChartData, getCustomers } from "@/lib/data-service"

export default function AdminDashboard() {
  const [chartTimeframe, setChartTimeframe] = useState("week")
  const [activeTab, setActiveTab] = useState("first-order")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredCalls, setFilteredCalls] = useState<Customer[]>([])
  const [stats, setStats] = useState({
    kpiData: {
      assignedCalls: 0,
      pendingCalls: 0,
      completedCalls: 0,
      totalCalls: 0,
    },
    tabData: [
      { id: "first-order", label: "First Order", count: 0 },
      { id: "second-order", label: "Second Order", count: 0 },
      { id: "third-order", label: "Third Order", count: 0 },
      { id: "fourth-order", label: "Fourth Order", count: 0 },
    ],
    pendingTasks: [],
  })
  const [chartData, setChartData] = useState([])
  const [statusChartData, setStatusChartData] = useState([])

  useEffect(() => {
    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail") || ""

    // Get dashboard stats
    const dashboardStats = getDashboardStats(userEmail)
    setStats(dashboardStats)

    // Get chart data
    const callChartData = getChartData(chartTimeframe as any)
    setChartData(callChartData)

    // Get status distribution for pie chart
    const customers = getCustomers()
    const statusCounts = {
      New: 0,
      "In Progress": 0,
      Closed: 0,
      Sold: 0,
    }

    customers.forEach((customer) => {
      statusCounts[customer.status]++
    })

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }))

    setStatusChartData(statusData)

    // Filter customers based on active tab (follow-up level)
    filterCustomers()
  }, [chartTimeframe, activeTab, searchQuery, statusFilter])

  const filterCustomers = () => {
    const customers = getCustomers()

    // Map tab ID to follow-up level
    const followUpLevelMap = {
      "first-order": 1,
      "second-order": 2,
      "third-order": 3,
      "fourth-order": 4,
    }

    let filtered = customers.filter((customer) => customer.followUpLevel === followUpLevelMap[activeTab])

    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.phoneNumber.includes(searchQuery) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((customer) => customer.status === statusFilter)
    }

    setFilteredCalls(filtered)
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Sold":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/customers/bulk-upload">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{stats.kpiData.totalCalls}</div>
            <div className="flex items-center mt-1">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="ml-2 text-xs text-blue-600 dark:text-blue-400">All registered customers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800 dark:text-indigo-300">New Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">{stats.kpiData.assignedCalls}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-indigo-500">+{Math.floor(Math.random() * 10) + 1}% from last week</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-300">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800 dark:text-amber-300">{stats.kpiData.pendingCalls}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-amber-500">{Math.floor(Math.random() * 5) - 2}% from last week</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">{stats.kpiData.completedCalls}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-500">+{Math.floor(Math.random() * 15) + 5}% from last week</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
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
                  <RechartsTooltip />
                  <Bar dataKey="calls" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Call Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Call Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Call Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="first-order" onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid w-full grid-cols-4">
              {stats.tabData.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="relative">
                  {tab.label}
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {tab.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {stats.tabData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id}>
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, phone or email..."
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
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("New")}>New</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("In Progress")}>In Progress</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Sold")}>Sold</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin/customers/bulk-upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Bulk Upload
                      </Link>
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
                        <TableHead>Tags</TableHead>
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
                            <TableCell className="font-medium">{call.name}</TableCell>
                            <TableCell>{call.phoneNumber}</TableCell>
                            <TableCell className="hidden md:table-cell">{call.email}</TableCell>
                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">{call.query}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{call.source}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {call.tags.course && (
                                  <Badge variant="outline" className="text-xs">
                                    {call.tags.course}
                                  </Badge>
                                )}
                                {call.tags.subject && (
                                  <Badge variant="outline" className="text-xs">
                                    {call.tags.subject}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/admin/customers/${call.id}`}>View</Link>
                                </Button>
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
    </div>
  )
}

