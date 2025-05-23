"use client"

import { useEffect, useState } from "react"
import { Filter, Search, Check, X, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { FilterDropdown } from "@/app/components/FilterDropdown"
import SourceTabs from "../../components/SourceTabs"
import FollowupLevelTabs from "@/app/components/FollowupLevelTabs"
import directus from '../../../lib/directus'
import { readItems } from "@directus/sdk"
import Link from "next/link"

export default function NewCallsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilters, setSourceFilters] = useState<string[] | "all">("all")
  const [activeTab, setActiveTab] = useState("all")

  const [termFilters, setTermFilters] = useState<string[]>([])
  const [courseFilters, setCourseFilters] = useState<string[]>([])
  const [subjectFilters, setSubjectFilters] = useState<string[]>([])
  const [facultyFilters, setFacultyFilters] = useState<string[]>([])
  const [customTag1Filters, setCustomTag1Filters] = useState<string[]>([])
  const [customTag2Filters, setCustomTag2Filters] = useState<string[]>([])

  const [allCalls, setAllCalls] = useState<any[]>([])
  const [filteredCalls, setFilteredCalls] = useState<any[]>([])
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])

  const [newCount, setNewCount] = useState(0)
  const [inProgressCount, setInProgressCount] = useState(0)
  const [closeCount, setCloseCount] = useState(0)
  const [soldCount, setSoldCount] = useState(0)

  useEffect(() => {
    const newCalls = allCalls.filter((call) => call.status === "New").length
    const inProgressCalls = allCalls.filter((call) => call.status === "In Progress").length
    const closeCalls = allCalls.filter((call) => call.status === "Close").length
    const soldCalls = allCalls.filter((call) => call.status === "Sold").length
  
    setNewCount(newCalls)
    setInProgressCount(inProgressCalls)
    setCloseCount(closeCalls)
    setSoldCount(soldCalls)
  }, [allCalls])

  const fetchLeads = async () => {
    try {
      const data = await directus.request(readItems("leads"));
  
      const userEmail = localStorage.getItem("userEmail");
  
      // Get today's date in IST
      const todayIST = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const todayDateIST = new Date(todayIST).toISOString().split("T")[0]; // 'YYYY-MM-DD'

      console.log(todayDateIST)
  
      // Filter leads assigned to the user and either:
      // - next_followup_date is today
      // - OR next_followup_date is empty/null/undefined
      const filteredLeads = data.filter((lead: any) => {
        const leadDate = lead.next_followup_date?.split("T")[0];
        return (
          lead.tele_caller === userEmail &&
          (leadDate === todayDateIST || !lead.next_followup_date)
        );
      });
  
      setAllCalls(filteredLeads);
    } catch (error) {
      console.error("Error fetching leads from Directus:", error);
    }
  };

  
  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    let filtered = [...allCalls]
  
    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.phone?.includes(searchQuery) ||
          call.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          call.query?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
  
    if (statusFilter !== "all") {
      filtered = filtered.filter((call) => call.status === statusFilter)
    }
  
    if (sourceFilters !== "all") {
      filtered = filtered.filter((call) => sourceFilters.includes(call.source))
    }
  
    if (activeTab !== "" && activeTab !== "all") {
      filtered = filtered.filter((call) => call.followup_level === activeTab)
    }
  
    const tagFilterGroups = [
      termFilters,
      courseFilters,
      subjectFilters,
      facultyFilters,
      customTag1Filters,
      customTag2Filters,
    ]
  
    if (tagFilterGroups.some(group => group.length > 0)) {
      filtered = filtered.filter(call =>
        tagFilterGroups.every(group =>
          group.length === 0 || group.some(tag => call.tags?.includes(tag))
        )
      )
    }
  
    setFilteredCalls(filtered)
  }, [
    searchQuery,
    statusFilter,
    sourceFilters,
    activeTab,
    termFilters,
    courseFilters,
    subjectFilters,
    facultyFilters,
    customTag1Filters,
    customTag2Filters,
    allCalls,
  ])

  const toggleCallSelection = (callId: string) => {
    setSelectedCalls((prev) =>
      prev.includes(callId) ? prev.filter((id) => id !== callId) : [...prev, callId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedCalls((prev) =>
      prev.length === filteredCalls.length ? [] : filteredCalls.map((call) => call.id)
    )
  }

  const handleAssignCalls = () => {
    toast({
      title: "Calls Assigned",
      description: `${selectedCalls.length} calls have been assigned.`,
    })
    setSelectedCalls([])
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSourceFilters("all")
    setTermFilters([])
    setCourseFilters([])
    setSubjectFilters([])
    setFacultyFilters([])
    setCustomTag1Filters([])
    setCustomTag2Filters([])
  }

  const handleRowClick = (id) => {
    window.location.href = `/staff/calls/${id}`;
  };


  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Dashboard</h1>
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
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 dark:bg-gray-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Close</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{closeCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{soldCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto pb-2">
            <FollowupLevelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex overflow-x-auto pb-2">
            <SourceTabs activeSourceTab={sourceFilters} setActiveSourceTab={setSourceFilters} />
          </div>

          <div className="mb-4 flex items-center justify-between gap-4 sticky top-0 bg-background z-10 py-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone or query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <FilterDropdown label="Term" collection="terms" tagFilters={termFilters} toggleTagFilter={(tag) =>
                setTermFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />
              <FilterDropdown label="Course" collection="courses" tagFilters={courseFilters} toggleTagFilter={(tag) =>
                setCourseFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />
              <FilterDropdown label="Subject" collection="subjects" tagFilters={subjectFilters} toggleTagFilter={(tag) =>
                setSubjectFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />
              <FilterDropdown label="Faculty" collection="faculties" tagFilters={facultyFilters} toggleTagFilter={(tag) =>
                setFacultyFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />
              <FilterDropdown label="Custom Tag 1" collection="custom_tags_one" tagFilters={customTag1Filters} toggleTagFilter={(tag) =>
                setCustomTag1Filters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />
              <FilterDropdown label="Custom Tag 2" collection="custom_tags_two" tagFilters={customTag2Filters} toggleTagFilter={(tag) =>
                setCustomTag2Filters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
              } />

              {(searchQuery ||
                statusFilter !== "all" ||
                sourceFilters !== "all" ||
                termFilters.length > 0 ||
                courseFilters.length > 0 ||
                subjectFilters.length > 0 ||
                facultyFilters.length > 0 ||
                customTag1Filters.length > 0 ||
                customTag2Filters.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead style={{width: '45%'}}>Query</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Follow-up Level</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => handleRowClick(call.id)}
                  >
                    <TableCell>{call.name}</TableCell>
                    <TableCell>{call.phone}</TableCell>
                    <TableCell style={{width: '45%'}}>{call.query}</TableCell>
                    <TableCell>{call.source}</TableCell>
                    <TableCell >{call.followup_level}</TableCell>
                    <TableCell>
                      {call.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">{tag.trim()}</Badge>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedCalls.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Assign Calls</h3>
            <p>You are about to assign {selectedCalls.length} calls to yourself.</p>
            <ul className="mt-2 space-y-1">
              {selectedCalls.map((id) => {
                const call = filteredCalls.find((c) => c.id === id)
                return call && (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {call.name} - {call.phone}
                  </li>
                )
              })}
            </ul>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setSelectedCalls([])}>Cancel</Button>
              <Button onClick={handleAssignCalls}>Confirm Assignment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
