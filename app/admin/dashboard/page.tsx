"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, Upload, Users } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"

const FOLLOW_UP_LEVELS = {
  "first-order": 1,
  "second-order": 2,
  "third-order": 3,
  "fourth-order": 4,
} as const

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"]

export default function AdminDashboard() {
  const [chartTimeframe, setChartTimeframe] = useState("week")
  const [activeTab, setActiveTab] = useState<keyof typeof FOLLOW_UP_LEVELS>("first-order")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [statusChartData, setStatusChartData] = useState([])
  const [kpiData, setKpiData] = useState({
    total: 0,
    assigned: 0,
    pending: 0,
    completed: 0,
  })

  const fetchLeads = async () => {
    try {
      const data = await directus.request(readItems('leads'));
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads from Directus:", error);
    }
  };

  const processLeads = useCallback(() => {
    // Basic KPI counts
    const total = leads.length
    const assigned = leads.filter(l => l.status === "New").length
    const pending = leads.filter(l => l.status === "In Progress").length
    const completed = leads.filter(l => l.status === "Closed" || l.status === "Sold").length

    setKpiData({ total, assigned, pending, completed })

    // Pie Chart Data: Calculating counts of each status
    const statusCounts = {
      "New": leads.filter(l => l.status === "New").length,
      "In Progress": leads.filter(l => l.status === "In Progress").length,
      "Closed": leads.filter(l => l.status === "Closed").length,
      "Sold": leads.filter(l => l.status === "Sold").length,
    }

    const chartData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }))
    setStatusChartData(chartData)

    // Filtered Leads (table)
    const currentLevel = FOLLOW_UP_LEVELS[activeTab]
    let filtered = leads.filter(l => l.followUpLevel === currentLevel)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        l =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(searchQuery)
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(l => l.status === statusFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, activeTab, searchQuery, statusFilter])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  useEffect(() => {
    processLeads()
  }, [leads, activeTab, searchQuery, statusFilter, processLeads])

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/customers/new"><Plus className="mr-2 h-4 w-4" /> New Customer</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/customers/bulk-upload"><Upload className="mr-2 h-4 w-4" /> Bulk Upload</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader><CardTitle>Total Customers</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{kpiData.total}</div>
            <Users className="h-4 w-4 mt-2 text-blue-600 dark:text-blue-400" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardHeader><CardTitle>New Calls</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-800 dark:text-indigo-300">{kpiData.assigned}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader><CardTitle>In Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-800 dark:text-amber-300">{kpiData.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">{kpiData.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <Card>
        <CardHeader><CardTitle>Call Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
  )
}
