"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  BarChart,
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
  LineChart,
  Line,
} from "recharts"
import { getCustomers, getSources, getTagsByType, exportCustomersToCSV } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("week")
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState(new Date())
  const [sourceFilter, setSourceFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [sources, setSources] = useState([])
  const [courses, setCourses] = useState([])

  const [overviewData, setOverviewData] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    inProgressCustomers: 0,
    closedCustomers: 0,
    soldCustomers: 0,
  })

  const [sourceChartData, setSourceChartData] = useState([])
  const [statusChartData, setStatusChartData] = useState([])
  const [courseChartData, setCourseChartData] = useState([])
  const [trendChartData, setTrendChartData] = useState([])

  useEffect(() => {
    setSources(getSources())
    setCourses(getTagsByType("course"))
  }, [])

  useEffect(() => {
    generateReports()
  }, [dateRange, startDate, endDate, sourceFilter, courseFilter, statusFilter])

  const generateReports = () => {
    const customers = getCustomers()

    const filteredCustomers = customers.filter((customer) => {
      const createdAt = new Date(customer.createdAt)

      // Filter by date range
      if (dateRange === "custom") {
        if (createdAt < startDate || createdAt > endDate) return false
      } else if (dateRange === "week") {
        if (createdAt < new Date(Date.now() - 7 * 86400000)) return false
      } else if (dateRange === "month") {
        if (createdAt < new Date(Date.now() - 30 * 86400000)) return false
      } else if (dateRange === "year") {
        if (createdAt < new Date(Date.now() - 365 * 86400000)) return false
      }

      // Filters
      if (sourceFilter !== "all" && customer.source !== sourceFilter) return false
      if (courseFilter !== "all" && customer.tags.course !== courseFilter) return false
      if (statusFilter !== "all" && customer.status !== statusFilter) return false

      return true
    })

    // KPI
    setOverviewData({
      totalCustomers: filteredCustomers.length,
      newCustomers: filteredCustomers.filter((c) => c.status === "New").length,
      inProgressCustomers: filteredCustomers.filter((c) => c.status === "In Progress").length,
      closedCustomers: filteredCustomers.filter((c) => c.status === "Closed").length,
      soldCustomers: filteredCustomers.filter((c) => c.status === "Sold").length,
    })

    // Source chart
    const sourceData = {}
    filteredCustomers.forEach((c) => {
      sourceData[c.source] = (sourceData[c.source] || 0) + 1
    })
    setSourceChartData(Object.entries(sourceData).map(([name, value]) => ({ name, value })))

    // Status chart
    setStatusChartData([
      { name: "New", value: filteredCustomers.filter((c) => c.status === "New").length },
      { name: "In Progress", value: filteredCustomers.filter((c) => c.status === "In Progress").length },
      { name: "Closed", value: filteredCustomers.filter((c) => c.status === "Closed").length },
      { name: "Sold", value: filteredCustomers.filter((c) => c.status === "Sold").length },
    ])

    // Course chart
    const courseData = {}
    filteredCustomers.forEach((c) => {
      if (c.tags.course) courseData[c.tags.course] = (courseData[c.tags.course] || 0) + 1
    })
    setCourseChartData(Object.entries(courseData).map(([name, value]) => ({ name, value })))

    // Trend chart
    const trendData = {}
    filteredCustomers.forEach((c) => {
      const date = new Date(c.createdAt)
      let key = ""

      if (dateRange === "week" || (dateRange === "custom" && (endDate - startDate) / 86400000 <= 14)) {
        key = date.toLocaleDateString()
      } else if (dateRange === "month" || (dateRange === "custom" && (endDate - startDate) / 86400000 <= 60)) {
        const week = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)
        key = `Week ${week}, ${date.toLocaleDateString("default", { month: "short" })}`
      } else {
        key = date.toLocaleDateString("default", { month: "short", year: "numeric" })
      }

      trendData[key] = (trendData[key] || 0) + 1
    })

    setTrendChartData(Object.entries(trendData).map(([date, count]) => ({ date, count })))
  }

  const handleExport = () => {
    try {
      const filters: any = {}
      if (statusFilter !== "all") filters.status = statusFilter
      if (courseFilter !== "all") filters.tags = { course: courseFilter }

      const csvContent = exportCustomersToCSV(filters)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `crm-report-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({ title: "Export successful", description: "Report data exported to CSV" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#f43f5e", "#6366f1"]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardContent style={{marginTop: 20}}>
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div>
                  <Label>Start Date</Label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </>
            )}

            <div>
              <Label>Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source.id} value={source.name}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course</Label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData.totalCustomers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">New</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData.newCustomers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData.inProgressCustomers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{overviewData.soldCustomers}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
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

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="count" stroke="#3b82f6" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sources">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sourceChartData} layout="vertical" margin={{ left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Course Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={courseChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {courseChartData.map((entry, index) => (
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
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="count" stroke="#3b82f6" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}