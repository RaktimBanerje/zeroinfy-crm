"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Filter, Search, Check, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
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
import { useRouter } from 'next/router';

// Dummy call data
const dummyCallData = {
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

export default function CallManagement() {
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

      {/* Tabs and Call Table */}
      <Card>
        <CardHeader className={`pb-2 sticky top-0 z-30 bg-background transition-all ${scrolled ? "shadow-md" : ""}`}>
          <CardTitle className={scrolled ? "sr-only" : ""}>Call Management</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="fresh-calls" onValueChange={setActiveTab}>
            <TabsList
              className={`mb-4 grid w-full grid-cols-5 sticky top-0 z-20 bg-background transition-all ${scrolled ? "top-0" : "top-16"}`}
            >
              {stats.tabData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  style={{ marginLeft: 10, marginRight: 10 }}
                  className={`relative 
                  ${tab.id === activeTab
                      ? (tab.id === "fresh-calls" ? "bg-blue-700 text-white" :
                        tab.id === "first-followup" ? "bg-green-700 text-white" :
                          tab.id === "second-followup" ? "bg-yellow-700 text-white" :
                            tab.id === "third-followup" ? "bg-orange-700 text-white" :
                              tab.id === "fourth-followup" ? "bg-red-700 text-white" : "bg-gray-700 text-white")
                      : (tab.id === "fresh-calls" ? "bg-blue-200 text-blue-600" :
                        tab.id === "first-followup" ? "bg-green-200 text-green-600" :
                          tab.id === "second-followup" ? "bg-yellow-200 text-yellow-600" :
                            tab.id === "third-followup" ? "bg-orange-200 text-orange-600" :
                              tab.id === "fourth-followup" ? "bg-red-200 text-red-600" : "bg-gray-200 text-gray-600")}
                  hover:bg-opacity-90 transition-all`}
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
                        className={`${activeSourceTab === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-200 text-blue-600"
                          } hover:bg-blue-500`}
                        onClick={() => setActiveSourceTab("all")}
                      >
                        All Sources
                      </Button>
                      <Button
                        variant={activeSourceTab === "missed-call-1" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "missed-call-1"
                            ? "bg-yellow-600 text-white"
                            : "bg-yellow-200 text-yellow-600"
                          } hover:bg-yellow-500`}
                        onClick={() => setActiveSourceTab("missed-call-1")}
                      >
                        Missed Call - 1
                      </Button>
                      <Button
                        variant={activeSourceTab === "missed-call-2" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "missed-call-2"
                            ? "bg-orange-600 text-white"
                            : "bg-orange-200 text-orange-600"
                          } hover:bg-orange-500`}
                        onClick={() => setActiveSourceTab("missed-call-2")}
                      >
                        Missed Call - 2
                      </Button>
                      <Button
                        variant={activeSourceTab === "received-call" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "received-call"
                            ? "bg-green-600 text-white"
                            : "bg-green-200 text-green-600"
                          } hover:bg-green-500`}
                        onClick={() => setActiveSourceTab("received-call")}
                      >
                        Received Call
                      </Button>
                      <Button
                        variant={activeSourceTab === "callback" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "callback"
                            ? "bg-teal-600 text-white"
                            : "bg-teal-200 text-teal-600"
                          } hover:bg-teal-500`}
                        onClick={() => setActiveSourceTab("callback")}
                      >
                        Callback
                      </Button>
                      <Button
                        variant={activeSourceTab === "whatsapp" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "whatsapp"
                            ? "bg-purple-600 text-white"
                            : "bg-purple-200 text-purple-600"
                          } hover:bg-purple-500`}
                        onClick={() => setActiveSourceTab("whatsapp")}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant={activeSourceTab === "abandoned-checkout" ? "default" : "outline"}
                        size="sm"
                        className={`${activeSourceTab === "abandoned-checkout"
                            ? "bg-pink-600 text-white"
                            : "bg-pink-200 text-pink-600"
                          } hover:bg-pink-500`}
                        onClick={() => setActiveSourceTab("abandoned-checkout")}
                      >
                        Abandoned Checkout
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
                      {/* Status Filter */}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Status {statusFilter !== "all" && `(${statusFilter})`}
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
                      </DropdownMenu> */}

                      {/* Source Filter */}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Sources {sourceFilters.length > 0 && `(${sourceFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                          {sources.map((source) => (
                            <DropdownMenuItem key={source} onClick={() => toggleSourceFilter(source)}>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border rounded flex items-center justify-center">
                                  {sourceFilters.includes(source) && <Check className="h-3 w-3" />}
                                </div>
                                {source}
                              </div>
                            </DropdownMenuItem>
                          ))}
                          {sourceFilters.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSourceFilters([])}>
                                Clear Source Filters
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu> */}

                      {/* Tags Filter - Separate Dropdowns */}
                      {/* Course Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Course {tagFilters.length > 0 && `(${tagFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Course</DropdownMenuLabel>
                          <Input
                            placeholder="Search ..."
                            className="mb-2"
                          />
                          <DropdownMenuItem onClick={() => toggleTagFilter('ca-final')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('ca-final') && <Check className="h-3 w-3" />}
                              </div>
                              CA Final
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('ca-inter')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('ca-inter') && <Check className="h-3 w-3" />}
                              </div>
                              CA Inter
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('ca-foundation')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('ca-foundation') && <Check className="h-3 w-3" />}
                              </div>
                              CA Foundation
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Term Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Term {tagFilters.length > 0 && `(${tagFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Term</DropdownMenuLabel>
                          <Input
                            placeholder="Search ..."
                            className="mb-2"
                          />
                          <DropdownMenuItem onClick={() => toggleTagFilter('may-2025')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('may-2025') && <Check className="h-3 w-3" />}
                              </div>
                              May 2025
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('nov-2025')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('nov-2025') && <Check className="h-3 w-3" />}
                              </div>
                              Nov 2025
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('may-2026')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('may-2026') && <Check className="h-3 w-3" />}
                              </div>
                              May 2026
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Subject Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Subject {tagFilters.length > 0 && `(${tagFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
                          <Input
                            placeholder="Search ..."
                            className="mb-2"
                          />
                          <DropdownMenuItem onClick={() => toggleTagFilter('accounts')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('accounts') && <Check className="h-3 w-3" />}
                              </div>
                              Accounts
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('law')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('law') && <Check className="h-3 w-3" />}
                              </div>
                              Law
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('taxation')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('taxation') && <Check className="h-3 w-3" />}
                              </div>
                              Taxation
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('audit')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('audit') && <Check className="h-3 w-3" />}
                              </div>
                              Audit
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Custom Tag 1 Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Custom Tag 1 {tagFilters.length > 0 && `(${tagFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Custom Tag 1</DropdownMenuLabel>
                          <Input
                            placeholder="Search ..."
                            className="mb-2"
                          />
                          <DropdownMenuItem onClick={() => toggleTagFilter('scholarship')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('scholarship') && <Check className="h-3 w-3" />}
                              </div>
                              Scholarship
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('faculty')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('faculty') && <Check className="h-3 w-3" />}
                              </div>
                              Faculty
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('emi')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('emi') && <Check className="h-3 w-3" />}
                              </div>
                              EMI
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('transfer')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('transfer') && <Check className="h-3 w-3" />}
                              </div>
                              Transfer
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Custom Tag 2 Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Custom Tag 2 {tagFilters.length > 0 && `(${tagFilters.length})`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by Custom Tag 2</DropdownMenuLabel>
                          <Input
                            placeholder="Search ..."
                            className="mb-2"
                          />
                          <DropdownMenuItem onClick={() => toggleTagFilter('weekend-batch')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('weekend-batch') && <Check className="h-3 w-3" />}
                              </div>
                              Weekend Batch
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('exam-pattern')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('exam-pattern') && <Check className="h-3 w-3" />}
                              </div>
                              Exam Pattern
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('study-material')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('study-material') && <Check className="h-3 w-3" />}
                              </div>
                              Study Material
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('batch-start')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('batch-start') && <Check className="h-3 w-3" />}
                              </div>
                              Batch Start
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTagFilter('placement')}>
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border rounded flex items-center justify-center">
                                {tagFilters.includes('placement') && <Check className="h-3 w-3" />}
                              </div>
                              Placement
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>


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

