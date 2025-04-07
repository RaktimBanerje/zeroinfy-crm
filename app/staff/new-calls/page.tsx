"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Filter, Search, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Dummy new call data
const newCallsData = [
  {
    id: "call1",
    name: "Rahul Sharma",
    phoneNumber: "+91 98765 43210",
    query: "Interested in CA Final course. Wants to know about the fee structure and study materials.",
    status: "New",
    source: "Website",
    tags: ["CA Final", "Accounts", "May 2025"],
  },
  {
    id: "call2",
    name: "Priya Patel",
    phoneNumber: "+91 87654 32109",
    query: "Looking for CA Inter coaching. Has questions about the batch timings and faculty.",
    status: "New",
    source: "Referral",
    tags: ["CA Inter", "Law"],
  },
  {
    id: "call3",
    name: "Amit Kumar",
    phoneNumber: "+91 76543 21098",
    query: "Wants to enroll for CA Foundation. Needs scholarship information and payment options.",
    status: "New",
    source: "Social Media",
    tags: ["CA Foundation", "Scholarship"],
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
  },
  {
    id: "call5",
    name: "Vikram Singh",
    phoneNumber: "+91 54321 09876",
    query: "Wants to know about the success rate and placement assistance for CA Final students.",
    status: "New",
    source: "Website",
    tags: ["CA Final", "Audit", "Placement"],
  },
]

// Sources for filtering
const sources = ["Website", "Phone Inquiry", "Referral", "Social Media", "Email Campaign"]

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

export default function NewCallsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [filteredCalls, setFilteredCalls] = useState(newCallsData)
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])
  const [showAssignConfirm, setShowAssignConfirm] = useState(false)

  useEffect(() => {
    // Filter calls based on search query and filters
    let filtered = [...newCallsData]

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
  }, [searchQuery, statusFilter, sourceFilters, tagFilters])

  // Toggle call selection
  const toggleCallSelection = (callId: string) => {
    setSelectedCalls((prev) => (prev.includes(callId) ? prev.filter((id) => id !== callId) : [...prev, callId]))
  }

  // Select all calls
  const toggleSelectAll = () => {
    if (selectedCalls.length === filteredCalls.length) {
      setSelectedCalls([])
    } else {
      setSelectedCalls(filteredCalls.map((call) => call.id))
    }
  }

  // Handle assigning calls
  const handleAssignCalls = () => {
    toast({
      title: "Calls Assigned",
      description: `${selectedCalls.length} calls have been assigned to you.`,
    })
    setSelectedCalls([])
    setShowAssignConfirm(false)
  }

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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Call Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>New Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 bg-background z-10 py-2">
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

          <div className="rounded-md border">
            <div className="max-h-[calc(100vh-300px)] overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedCalls.length === filteredCalls.length && filteredCalls.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4"
                          aria-label="Select all calls"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="w-[40%]">Query</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Tags</TableHead>
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
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedCalls.includes(call.id)}
                              onChange={() => toggleCallSelection(call.id)}
                              className="h-4 w-4"
                              aria-label={`Select call from ${call.name}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{call.name}</TableCell>
                        <TableCell>{call.phoneNumber}</TableCell>
                        <TableCell className="max-w-[400px]">
                          <div className="line-clamp-2">{call.query}</div>
                        </TableCell>
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assign Calls Confirmation */}
      {showAssignConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Assign Calls</h3>
            <p className="text-muted-foreground mb-4">
              You are about to assign {selectedCalls.length} call{selectedCalls.length > 1 ? "s" : ""} to yourself.
            </p>
            <div className="py-2 max-h-[200px] overflow-auto">
              <p>Selected calls:</p>
              <ul className="mt-2 space-y-2">
                {selectedCalls.map((id) => {
                  const call = newCallsData.find((c) => c.id === id)
                  return call ? (
                    <li key={id} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>
                        {call.name} - {call.phoneNumber}
                      </span>
                    </li>
                  ) : null
                })}
              </ul>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAssignConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignCalls}>Confirm Assignment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

