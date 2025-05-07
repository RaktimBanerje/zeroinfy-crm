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
import { readItems, updateItem } from "@directus/sdk"
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

  const [users, setUsers] = useState<any[]>([])  // Users state to hold the list of users
  const [selectedUser, setSelectedUser] = useState<string | null>(null)  // Track the selected user
  const [isModalOpen, setIsModalOpen] = useState(false)  // Control modal visibility

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
          (leadDate === todayDateIST || !lead.next_followup_date)
        );
      });
  
      setAllCalls(filteredLeads);
    } catch (error) {
      console.error("Error fetching leads from Directus:", error);
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await fetch("https://zeroinfy.thinksurfmedia.in/users", {
        method: "GET",
        headers: {
          "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
      })
      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchLeads()
    fetchUsers()  // Fetch users when the component mounts
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

  const handleAssignCalls = async () => {
    console.log(selectedUser)
    const userEmail = selectedUser 
    if (!userEmail) {
      toast({ title: "Error", description: "User email not found." })
      return
    }

    try {
      // Update each selected call with the `tele_caller` field
      for (const callId of selectedCalls) {
        await directus.request(updateItem("leads", callId, { tele_caller: userEmail }))
      }

      toast({
        title: "Calls Assigned",
        description: `${selectedCalls.length} calls have been assigned to you.`,
      })
      setSelectedCalls([])  // Clear the selected calls
      setIsModalOpen(false)  // Close the modal
      fetchLeads()
    } catch (error) {
      console.error("Error assigning calls:", error)
      toast({ title: "Error", description: "An error occurred while assigning calls." })
    }
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

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto pb-2">
            <FollowupLevelTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex overflow-x-auto pb-2">
            <SourceTabs activeSourceTab={sourceFilters} setActiveSourceTab={setSourceFilters} />
          </div>

          <div className="mb-4 flex items-center justify-between gap-4 sticky top-0 bg-background z-10 py-2">
            {/* Left side: Search input */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone or query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px]"
              />
            </div>

            {/* Right side: Button & Clear Filters */}
            <div className="flex items-center gap-2">
              {selectedCalls.length > 0 && (
                <Button onClick={() => setIsModalOpen(true)}>
                  Assign Selected Calls
                </Button>
              )}
              {searchQuery && (
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
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedCalls.length === filteredCalls.length && filteredCalls.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Follow-up Level</TableHead>
                <TableHead>Tele Caller</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCalls.map((call) => {
                const teleCaller = users.find((user) => user.email === call.tele_caller);

                return (
                  <TableRow
                    key={call.id}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCalls.includes(call.id)}
                        onChange={() => toggleCallSelection(call.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>{call.name}</TableCell>
                    <TableCell>{call.phone}</TableCell>
                    <TableCell>{call.query}</TableCell>
                    <TableCell>{call.source}</TableCell>
                    <TableCell>{call.followup_level}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500 text-white" variant="outline">
                        {teleCaller?.first_name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {call.tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline">{tag.trim()}</Badge>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Assign Calls</h3>
            <p>You are about to assign {selectedCalls.length} calls to a user.</p>

            {/* User Selection */}
            <div className="mt-4">
              <select
                value={selectedUser || ""}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a user</option>
                {users
                  .filter((user) => user.email !== "admin@example.com")
                  .map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.first_name}
                    </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignCalls}>Confirm Assignment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
