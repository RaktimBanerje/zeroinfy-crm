"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from 'next/router'
import Link from "next/link"
import { Filter, Search, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { FilterDropdown } from "@/app/components/FilterDropdown"


export default function StaffDashboard() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("fresh-calls")
  const [activeSourceTab, setActiveSourceTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [filteredCalls, setFilteredCalls] = useState(expandedCallData["fresh-calls"])

  const [scrolled, setScrolled] = useState(false)
  const tableContainerRef = useRef(null)

  // Memoized function for applying filters
  const applyFilters = useCallback(() => {
    let filtered = [...expandedCallData[activeTab]]

    if (activeSourceTab !== "all") {
      filtered = filtered.filter((call) => call.source === activeSourceTab)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.phoneNumber.includes(searchQuery) ||
          call.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          call.query.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((call) => call.status === statusFilter)
    }

    if (sourceFilters.length > 0) {
      filtered = filtered.filter((call) => sourceFilters.includes(call.source))
    }

    if (tagFilters.length > 0) {
      filtered = filtered.filter((call) => call.tags.some((tag) => tagFilters.includes(tag)))
    }

    setFilteredCalls(filtered)
  }, [activeTab, activeSourceTab, searchQuery, statusFilter, sourceFilters, tagFilters])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Scroll event to toggle sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current) {
        setScrolled(tableContainerRef.current.scrollTop > 10)
      }
    }

    const tableContainer = tableContainerRef.current
    tableContainer?.addEventListener("scroll", handleScroll)

    return () => {
      tableContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setSourceFilters([])
    setTagFilters([])
  }

  const handleTableRowClick = (id: string) => {
    document.getElementById(`btn${id}`)?.click()
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader className={`pb-2 sticky top-0 z-30 bg-background transition-all ${scrolled ? "shadow-md" : ""}`}>
          <CardTitle className={scrolled ? "sr-only" : ""}>Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="fresh-calls" onValueChange={setActiveTab}>
            <TabsList className={`mb-4 grid w-full grid-cols-6 sticky top-0 z-20 bg-background transition-all ${scrolled ? "top-0" : "top-16"}`}>
              {stats.tabData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  style={{
                    marginLeft: "10px",
                    marginRight: "10px",
                    backgroundColor: tab.id === activeTab ? "#4CAF50" : "#A5D6A7",
                    color: tab.id === activeTab ? "white" : "#388E3C",
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
                <div className={`space-y-4 sticky z-10 bg-background transition-all ${scrolled ? "top-14" : "top-[8.5rem]"}`}>
                  <div className="flex overflow-x-auto pb-2">
                    <div className="flex space-x-1">
                      <SourceTabs activeSourceTab={sourceFilters} setActiveSourceTab={setSourceFilters} />
                    </div>
                  </div>

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
                      <FilterDropdown
                        label="Term"
                        collection="terms"
                        tagFilters={tagFilters}
                        toggleTagFilter={setTagFilters}
                      />
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border mt-4">
                  <div ref={tableContainerRef} className="overflow-y-auto aa" style={{ maxHeight: "60vh" }}>
                    <Table className="w-full">
                      <TableHeader className="sticky top-0 bg-muted z-10">
                        <TableRow>
                          <TableHead>Customer Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead className="w-[40%]">Query</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Tags</TableHead>
                        </TableRow>
                      </TableHeader>
                      {/* <TableBody>
                        {filteredCalls.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center">No calls found.</TableCell>
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
                              <TableCell className="max-w-[400px]"><div className="line-clamp-2">{call.query}</div></TableCell>
                              <TableCell>{call.source}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {call.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                                  ))}
                                  {call.tags.length > 2 && <Badge variant="outline" className="text-xs">+{call.tags.length - 2}</Badge>}
                                  <Button id={`btn${call.id}`} variant="ghost" size="sm" asChild style={{ display: 'none' }}>
                                    <Link href={`/staff/calls/${call.id}`}>View</Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody> */}
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
