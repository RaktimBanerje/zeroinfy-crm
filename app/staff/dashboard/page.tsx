"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/router'
import Link from "next/link"
import { Filter, Search, Check, X, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { FilterDropdown } from "@/app/components/FilterDropdown"

// Dummy data for assigned calls by source
const pendingCallsBySource = {
  Website: 12,
  "Phone Inquiry": 8,
  Referral: 15,
  "Social Media": 7,
  "Email Campaign": 4,
}

// Dummy data for pending calls by source
const freshCallsBySource = {
  Website: 8,
  "Phone Inquiry": 5,
  Referral: 6,
  "Social Media": 10,
  "Email Campaign": 3,
}

// Dummy data for completed calls by source
const followUpCallsBySource = {
  Website: 18,
  "Phone Inquiry": 12,
  Referral: 9,
  "Social Media": 14,
  "Email Campaign": 7,
}

// Dummy call data
const dummyCallData = {
  "all-calls": [
    {
      id: "call1",
      name: "Rahul Sharma",
      phoneNumber: "+91 98765 43210",
      query: "Interested in CA Final course. Wants to know about the fee structure and study materials.",
      status: "New",
      source: "Website",
      tags: ["CA Final", "Accounts", "May 2025"],
      assigned: false,
    },
    {
      id: "call2",
      name: "Priya Patel",
      phoneNumber: "+91 87654 32109",
      query: "Looking for CA Inter coaching. Has questions about the batch timings and faculty.",
      status: "New",
      source: "Referral",
      tags: ["CA Inter", "Law"],
      assigned: false,
    },
    {
      id: "call3",
      name: "Amit Kumar",
      phoneNumber: "+91 76543 21098",
      query: "Wants to enroll for CA Foundation. Needs scholarship information and payment options.",
      status: "New",
      source: "Social Media",
      tags: ["CA Foundation", "Scholarship"],
      assigned: false,
    },
    {
      id: "call4",
      name: "Sneha Gupta",
      phoneNumber: "+91 65432 10987",
      query:
        "Interested in switching from another coaching institute. Wants to know the process and if any credits can be transferred.",
      status: "New",
      source: "Phone Inquiry",
      tags: ["CA Final", "Taxation", "Transfer"],
      assigned: false,
    },
    {
      id: "call5",
      name: "Vikram Singh",
      phoneNumber: "+91 54321 09876",
      query: "Wants to know about the success rate and placement assistance for CA Final students.",
      status: "New",
      source: "Website",
      tags: ["CA Final", "Audit", "Placement"],
      assigned: false,
    },
  ],
  "fresh-calls": [
    {
      id: "call1",
      name: "Rahul Sharma",
      phoneNumber: "+91 98765 43210",
      query: "Interested in CA Final course. Wants to know about the fee structure and study materials.",
      status: "New",
      source: "Website",
      tags: ["CA Final", "Accounts", "May 2025"],
      assigned: false,
    },
    {
      id: "call2",
      name: "Priya Patel",
      phoneNumber: "+91 87654 32109",
      query: "Looking for CA Inter coaching. Has questions about the batch timings and faculty.",
      status: "New",
      source: "Referral",
      tags: ["CA Inter", "Law"],
      assigned: false,
    },
    {
      id: "call3",
      name: "Amit Kumar",
      phoneNumber: "+91 76543 21098",
      query: "Wants to enroll for CA Foundation. Needs scholarship information and payment options.",
      status: "New",
      source: "Social Media",
      tags: ["CA Foundation", "Scholarship"],
      assigned: false,
    },
    {
      id: "call4",
      name: "Sneha Gupta",
      phoneNumber: "+91 65432 10987",
      query:
        "Interested in switching from another coaching institute. Wants to know the process and if any credits can be transferred.",
      status: "New",
      source: "Phone Inquiry",
      tags: ["CA Final", "Taxation", "Transfer"],
      assigned: false,
    },
    {
      id: "call5",
      name: "Vikram Singh",
      phoneNumber: "+91 54321 09876",
      query: "Wants to know about the success rate and placement assistance for CA Final students.",
      status: "New",
      source: "Website",
      tags: ["CA Final", "Audit", "Placement"],
      assigned: false,
    },
  ],
  "first-followup": [
    {
      id: "call6",
      name: "Neha Verma",
      phoneNumber: "+91 43210 98765",
      query: "Following up on CA Inter course details. Has specific questions about the study material and mock tests.",
      status: "In Progress",
      source: "Email Campaign",
      tags: ["CA Inter", "Accounts", "Study Material"],
      assigned: true,
    },
    {
      id: "call7",
      name: "Rajesh Kumar",
      phoneNumber: "+91 32109 87654",
      query: "Interested in CA Final weekend batches. Wants to know the schedule and duration.",
      status: "New",
      source: "Referral",
      tags: ["CA Final", "Law", "Weekend Batch"],
      assigned: true,
    },
    {
      id: "call8",
      name: "Ananya Desai",
      phoneNumber: "+91 21098 76543",
      query: "Has questions about the CA Foundation exam pattern and how the coaching addresses it.",
      status: "Closed",
      source: "Website",
      tags: ["CA Foundation", "Exam Pattern"],
      assigned: true,
    },
  ],
  "second-followup": [
    {
      id: "call9",
      name: "Karan Malhotra",
      phoneNumber: "+91 10987 65432",
      query: "Discussing payment options for CA Final course. Interested in EMI plans.",
      status: "In Progress",
      source: "Phone Inquiry",
      tags: ["CA Final", "Accounts", "EMI"],
      assigned: true,
    },
    {
      id: "call10",
      name: "Meera Joshi",
      phoneNumber: "+91 09876 54321",
      query: "Following up on scholarship application for CA Inter. Submitted documents last week.",
      status: "Closed",
      source: "Website",
      tags: ["CA Inter", "Taxation", "Scholarship"],
      assigned: true,
    },
  ],
  "third-followup": [
    {
      id: "call11",
      name: "Arjun Reddy",
      phoneNumber: "+91 98765 12345",
      query: "Final discussion before enrollment in CA Final course. Has questions about the faculty.",
      status: "Sold",
      source: "Referral",
      tags: ["CA Final", "Audit", "Faculty"],
      assigned: true,
    },
    {
      id: "call12",
      name: "Pooja Sharma",
      phoneNumber: "+91 87654 23456",
      query: "Ready to enroll in CA Foundation course. Wants to confirm the batch start date.",
      status: "In Progress",
      source: "Social Media",
      tags: ["CA Foundation", "Batch Start"],
      assigned: true,
    },
  ],
  "fourth-followup": [
    {
      id: "call13",
      name: "Sanjay Mehta",
      phoneNumber: "+91 76543 98765",
      query: "Final discussion about payment options for CA Inter course. Ready to make the payment.",
      status: "Sold",
      source: "Website",
      tags: ["CA Inter", "Payment Options"],
      assigned: true,
    },
    {
      id: "call14",
      name: "Anita Desai",
      phoneNumber: "+91 65432 87654",
      query: "Confirming enrollment details for CA Foundation. Has completed all requirements.",
      status: "Sold",
      source: "Referral",
      tags: ["CA Foundation", "Enrollment"],
      assigned: true,
    },
  ],
}

// Add this after the existing dummyCallData declaration
// Generate more test data
const generateMoreTestData = () => {
  const result = { ...dummyCallData }

  // Names and queries for test data
  const names = [
    "Aditya Sharma",
    "Priyanka Patel",
    "Raj Malhotra",
    "Sunita Gupta",
    "Vikram Singh",
    "Neha Verma",
    "Karan Kapoor",
    "Anjali Desai",
    "Rahul Khanna",
    "Meera Joshi",
  ]
  const queries = [
    "Interested in CA Final course and fee structure",
    "Looking for weekend batches for CA Inter",
    "Wants to know about scholarship options for CA Foundation",
    "Inquiring about faculty for Taxation subject",
    "Needs information about study materials and mock tests",
    "Asking about payment plans and EMI options",
    "Interested in transferring from another institute",
    "Questions about the exam pattern and success rate",
    "Wants to know about placement assistance after course completion",
    "Inquiring about batch start dates and schedule",
  ]

  // Add 30 more entries to each category
  Object.keys(result).forEach((key) => {
    for (let i = 0; i < 30; i++) {
      const nameIndex = Math.floor(Math.random() * names.length)
      const queryIndex = Math.floor(Math.random() * queries.length)
      const statusOptions = ["New", "In Progress", "Closed", "Sold"]
      const statusIndex = Math.floor(Math.random() * statusOptions.length)
      const sourceOptions = ["Website", "Phone Inquiry", "Referral", "Social Media", "Email Campaign"]
      const sourceIndex = Math.floor(Math.random() * sourceOptions.length)
      const tagOptions = [
        "CA Final",
        "CA Inter",
        "CA Foundation",
        "Accounts",
        "Law",
        "Taxation",
        "Audit",
        "May 2025",
        "Nov 2025",
        "Scholarship",
        "Faculty",
        "EMI",
        "Transfer",
        "Weekend Batch",
        "Exam Pattern",
        "Study Material",
        "Batch Start",
        "Placement",
      ]

      // Generate 1-3 random tags
      const numTags = Math.floor(Math.random() * 3) + 1
      const tags = []
      for (let j = 0; j < numTags; j++) {
        const tagIndex = Math.floor(Math.random() * tagOptions.length)
        if (!tags.includes(tagOptions[tagIndex])) {
          tags.push(tagOptions[tagIndex])
        }
      }

      result[key].push({
        id: `${key}-extra-${i}`,
        name: names[nameIndex],
        phoneNumber: `+91 ${Math.floor(10000 + Math.random() * 90000)} ${Math.floor(10000 + Math.random() * 90000)}`,
        query: queries[queryIndex],
        status: statusOptions[statusIndex],
        source: sourceOptions[sourceIndex],
        tags: tags,
        assigned: Math.random() > 0.5,
      })
    }
  })

  return result
}

// Replace dummyCallData with the expanded version
const expandedCallData = generateMoreTestData()

// Sources for filtering
const sources = ["Missed Call", "Received Call", "Callback", "WhatsApp", "Abandoned Checkout"]

// Tags for filtering
const allTags = [
  "CA Final",
  "CA Inter",
  "CA Foundation",
  "Accounts",
  "Law",
  "Taxation",
  "Audit",
  "May 2025",
  "Nov 2025",
  "Scholarship",
  "Faculty",
  "EMI",
  "Transfer",
  "Weekend Batch",
  "Exam Pattern",
  "Study Material",
  "Batch Start",
  "Placement",
]


export default function StaffDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("fresh-calls")
  const [activeSourceTab, setActiveSourceTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [filteredCalls, setFilteredCalls] = useState(expandedCallData["fresh-calls"])
  const [stats, setStats] = useState({
    tabData: [
      { id: "all-calls", label: "All Calls", count: expandedCallData["all-calls"].length },
      { id: "fresh-calls", label: "Fresh Calls", count: expandedCallData["fresh-calls"].length },
      { id: "first-followup", label: "First Follow-up", count: expandedCallData["first-followup"].length },
      { id: "second-followup", label: "Second Follow-up", count: expandedCallData["second-followup"].length },
      { id: "third-followup", label: "Third Follow-up", count: expandedCallData["third-followup"].length },
      { id: "fourth-followup", label: "Fourth Follow-up", count: expandedCallData["fourth-followup"].length },
    ],
  })

  // Add these state variables after the other useState declarations
  const [scrolled, setScrolled] = useState(false)
  const tableContainerRef = useRef(null)

  useEffect(() => {
    // Filter calls based on active tab, search query, and filters
    let filtered = [...expandedCallData[activeTab]]

    // Apply source tab filter
    if (activeSourceTab !== "all") {
      filtered = filtered.filter((call) => call.source === activeSourceTab)
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.phoneNumber.includes(searchQuery) ||
          call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          call.query.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((call) => call.status === statusFilter)
    }

    // Apply source filters
    if (sourceFilters.length > 0) {
      filtered = filtered.filter((call) => sourceFilters.includes(call.source))
    }

    // Apply tag filters
    if (tagFilters.length > 0) {
      filtered = filtered.filter((call) => call.tags.some((tag) => tagFilters.includes(tag)))
    }

    setFilteredCalls(filtered)

  }, [activeTab, activeSourceTab, searchQuery, statusFilter, sourceFilters, tagFilters])

  // Add this useEffect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current) {
        setScrolled(tableContainerRef.current.scrollTop > 10)
      }
    }

    const tableContainer = tableContainerRef.current
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll)
      return () => {
        tableContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  // Toggle source filter
  const toggleSourceFilter = (source: string) => {
    setSourceFilters((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSourceFilters([])
    setTagFilters([])
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
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

  const buttonRefs = useRef({}); // To store references to each button

  const handleTableRowClick = (id) => {
    console.log(id); // Logs the ID correctly

    // Get the button element and trigger the click event
    const button = document.getElementById(`btn${id}`);
    if (button) {
      button.click(); // Programmatically trigger the click event
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/staff/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              New Customer
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/staff/customers/bulk-upload">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-50 dark:bg-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">76</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className={`pb-2 sticky top-0 z-30 bg-background transition-all ${scrolled ? "shadow-md" : ""}`}>
          <CardTitle className={scrolled ? "sr-only" : ""}>Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="fresh-calls" onValueChange={setActiveTab}>
            <TabsList
              className={`mb-4 grid w-full grid-cols-6 sticky top-0 z-20 bg-background transition-all ${scrolled ? "top-0" : "top-16"}`}
            >
              {stats.tabData.map((tab) => (
                <TabsTrigger
                key={tab.id}
                value={tab.id}
                style={{
                  marginLeft: "10px",
                  marginRight: "10px",
                  backgroundColor: tab.id === activeTab
                    ? (tab.id === "fresh-calls" ? "#4CAF50" :
                      tab.id === "first-followup" ? "#FF9800" :
                      tab.id === "second-followup" ? "#F44336" :
                      tab.id === "third-followup" ? "#2196F3" :
                      tab.id === "fourth-followup" ? "#9C27B0" :
                      tab.id === "all-calls" ? "#3F51B5" : "rgb(245, 48, 48)")
                    : (tab.id === "fresh-calls" ? "#A5D6A7" :
                      tab.id === "first-followup" ? "#FFCC80" :
                      tab.id === "second-followup" ? "#FFCDD2" :
                      tab.id === "third-followup" ? "#BBDEFB" :
                      tab.id === "fourth-followup" ? "#E1BEE7" :
                      tab.id === "all-calls" ? "#C5CAE9" : "#F5F5F5"),
                  color: tab.id === activeTab
                    ? "white"
                    : (tab.id === "fresh-calls" ? "#388E3C" :
                      tab.id === "first-followup" ? "#FF5722" :
                      tab.id === "second-followup" ? "#D32F2F" :
                      tab.id === "third-followup" ? "#1976D2" :
                      tab.id === "fourth-followup" ? "#8E24AA" :
                      tab.id === "all-calls" ? "#303F9F" : "#757575"),
                }}
                className="relative hover:bg-opacity-90 transition-all"
              >
                {tab.label}
                <span style={{ right: 10, top: 5 }} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {tab.count}
                </span>
              </TabsTrigger>
              ))}
            </TabsList>

            {stats.tabData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="px-6">
                <div
                  className={`space-y-4 sticky z-10 bg-background transition-all ${scrolled ? "top-14" : "top-[8.5rem]"}`}
                >
                  {/* Source Tabs */}
                  <div className="flex overflow-x-auto pb-2">
                    <div className="flex space-x-1">
                      <Button
                        variant={activeSourceTab === "all" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "all" ? "#00BCD4" : "#B2EBF2", // Cyan color for All Sources
                          color: activeSourceTab === "all" ? "white" : "#00ACC1",
                        }}
                        onClick={() => setActiveSourceTab("all")}
                        className="relative w-[160px]"
                      >
                        All Sources
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          35
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "missed-call-1" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "missed-call-1" ? "#FF5722" : "#FFCCBC", // Deep Orange for Missed Call - 1
                          color: activeSourceTab === "missed-call-1" ? "white" : "#D32F2F",
                        }}
                        onClick={() => setActiveSourceTab("missed-call-1")}
                        className="relative w-[160px]"
                      >
                        Missed Call - 1
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "missed-call-2" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "missed-call-2" ? "#FFC107" : "#FFF59D", // Amber for Missed Call - 2
                          color: activeSourceTab === "missed-call-2" ? "white" : "#F57C00",
                        }}
                        onClick={() => setActiveSourceTab("missed-call-2")}
                        className="relative w-[160px]"
                      >
                        Missed Call - 2
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "received-call" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "received-call" ? "#8BC34A" : "#C8E6C9", // Light Green for Received Call
                          color: activeSourceTab === "received-call" ? "white" : "#388E3C",
                        }}
                        onClick={() => setActiveSourceTab("received-call")}
                        className="relative w-[160px]"
                      >
                        Received Call
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "callback" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "callback" ? "#673AB7" : "#D1C4E9", // Deep Purple for Callback
                          color: activeSourceTab === "callback" ? "white" : "#512DA8",
                        }}
                        onClick={() => setActiveSourceTab("callback")}
                        className="relative w-[160px]"
                      >
                        Callback
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "whatsapp" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "whatsapp" ? "#009688" : "#B2DFDB", // Teal for WhatsApp
                          color: activeSourceTab === "whatsapp" ? "white" : "#00796B",
                        }}
                        onClick={() => setActiveSourceTab("whatsapp")}
                        className="relative w-[160px]"
                      >
                        WhatsApp
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          5
                        </span>
                      </Button>

                      <Button
                        variant={activeSourceTab === "abandoned-checkout" ? "default" : "outline"}
                        size="sm"
                        style={{
                          backgroundColor: activeSourceTab === "abandoned-checkout" ? "#607D8B" : "#CFD8DC", // Blue Grey for Abandoned Checkout
                          color: activeSourceTab === "abandoned-checkout" ? "white" : "#455A64",
                        }}
                        onClick={() => setActiveSourceTab("abandoned-checkout")}
                        className="relative w-[160px]"
                      >
                        Checkout
                        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          10
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone or query..."
                        className="w-full md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Tags Filter - Separate Dropdowns */}
                      {/* Term Dropdown */}
                      <FilterDropdown
                        label="Term"
                        collection="terms"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      <FilterDropdown
                        label="Course"
                        collection="courses"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      <FilterDropdown
                        label="Subject"
                        collection="subjects"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      <FilterDropdown
                        label="Faculty"
                        collection="faculties"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      <FilterDropdown
                        label="Custom Tag 1"
                        collection="custom_tags_one"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      <FilterDropdown
                        label="Custom Tag 2"
                        collection="custom_tags_two"
                        tagFilters={tagFilters}
                        toggleTagFilter={toggleTagFilter}
                      />

                      {/* Clear All Filters */}
                      {(searchQuery || statusFilter !== "all" || sourceFilters.length > 0 || tagFilters.length > 0) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="mr-2 h-4 w-4" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-md border mt-4">
                  <div
                    ref={tableContainerRef}
                    className="overflow-y-auto aa"
                    style={{ maxHeight: "60vh" }} // height set to 60vh or any height you prefer for the scrollable body
                  >
                    <Table className="w-full">
                      <TableHeader className="sticky top-0 bg-muted z-10" style={{ position: 'sticky', top: 0 }}>
                        <TableRow>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead className="w-[40%]">Query</TableHead>
                          {/* <TableHead>Status</TableHead> */}
                          <TableHead>Source</TableHead>
                          <TableHead>Tags</TableHead>
                          {/* <TableHead>Actions</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCalls.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">
                              No calls found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredCalls.map((call) => (
                            <TableRow key={call.id} onClick={() => handleTableRowClick(call.id)}>
                              <TableCell className="font-medium hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <span>{call.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{call.phoneNumber}</TableCell>
                              <TableCell className="max-w-[400px]">
                                <div className="line-clamp-2">{call.query}</div>
                              </TableCell>
                              {/* <TableCell>
                                <Badge className={getStatusColor(call.status)}>{call.status}</Badge>
                              </TableCell> */}
                              <TableCell>{call.source}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {call.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {call.tags.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{call.tags.length - 2}
                                    </Badge>
                                  )}

                                  <Button id={`btn${call.id}`} variant="ghost" size="sm" asChild style={{ display: 'none' }}>
                                    <Link href={`/staff/calls/${call.id}`}>View</Link>
                                  </Button>
                                </div>
                              </TableCell>
                              {/* <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/staff/calls/${call.id}`}>View</Link>
                                </Button>
                              </TableCell> */}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

