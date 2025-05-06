"use client";

import { useEffect, useState } from "react";
import { Filter, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { FilterDropdown } from "@/app/components/FilterDropdown";
import SourceTabs from "../../components/SourceTabs";
import directus from '../../../lib/directus';
import { readItems } from "@directus/sdk";

export default function NewCallsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilters, setSourceFilters] = useState([]);

  // 🧠 Individual tag filters per dropdown
  const [termFilters, setTermFilters] = useState([]);
  const [courseFilters, setCourseFilters] = useState([]);
  const [subjectFilters, setSubjectFilters] = useState([]);
  const [facultyFilters, setFacultyFilters] = useState([]);
  const [customTag1Filters, setCustomTag1Filters] = useState([]);
  const [customTag2Filters, setCustomTag2Filters] = useState([]);

  const [allCalls, setAllCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [selectedCalls, setSelectedCalls] = useState([]);

  // Fetch leads from Directus
  const fetchLeads = async () => {
    try {
      const data = await directus.request(readItems('leads'));
      setAllCalls(data);
    } catch (error) {
      console.error("Error fetching leads from Directus:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter calls based on all filters
  useEffect(() => {
    let filtered = [...allCalls];

    if (searchQuery) {
      filtered = filtered.filter(
        (call) =>
          call.phone?.includes(searchQuery) ||
          call.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          call.query?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((call) => call.status === statusFilter);
    }

    if (sourceFilters.length > 0) {
      filtered = filtered.filter((call) => sourceFilters.includes(call.source));
    }

    // Tag filtering
    const tagFilterGroups = [
      termFilters,
      courseFilters,
      subjectFilters,
      facultyFilters,
      customTag1Filters,
      customTag2Filters,
    ];

    if (tagFilterGroups.some(group => group.length > 0)) {
      filtered = filtered.filter(call =>
        tagFilterGroups.every(group =>
          group.length === 0 || group.some(tag => call.tags?.includes(tag))
        )
      );
    }

    setFilteredCalls(filtered);
  }, [
    searchQuery,
    statusFilter,
    sourceFilters,
    termFilters,
    courseFilters,
    subjectFilters,
    facultyFilters,
    customTag1Filters,
    customTag2Filters,
    allCalls,
  ]);

  const toggleCallSelection = (callId) => {
    setSelectedCalls((prev) =>
      prev.includes(callId) ? prev.filter((id) => id !== callId) : [...prev, callId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedCalls((prev) =>
      prev.length === filteredCalls.length ? [] : filteredCalls.map((call) => call.id)
    );
  };

  const handleAssignCalls = () => {
    toast({
      title: "Calls Assigned",
      description: `${selectedCalls.length} calls have been assigned.`,
    });
    setSelectedCalls([]);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilters([]);
    setTermFilters([]);
    setCourseFilters([]);
    setSubjectFilters([]);
    setFacultyFilters([]);
    setCustomTag1Filters([]);
    setCustomTag2Filters([]);
  };

  const handleRowClick = (id: string) => {
    window.location.href = `/staff/calls/${id}`;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Calls</CardTitle>
        </CardHeader>
        <CardContent>
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
              <FilterDropdown
                label="Term"
                collection="terms"
                tagFilters={termFilters}
                toggleTagFilter={(tag) =>
                  setTermFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />
              <FilterDropdown
                label="Course"
                collection="courses"
                tagFilters={courseFilters}
                toggleTagFilter={(tag) =>
                  setCourseFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />
              <FilterDropdown
                label="Subject"
                collection="subjects"
                tagFilters={subjectFilters}
                toggleTagFilter={(tag) =>
                  setSubjectFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />
              <FilterDropdown
                label="Faculty"
                collection="faculties"
                tagFilters={facultyFilters}
                toggleTagFilter={(tag) =>
                  setFacultyFilters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />
              <FilterDropdown
                label="Custom Tag 1"
                collection="custom_tags_one"
                tagFilters={customTag1Filters}
                toggleTagFilter={(tag) =>
                  setCustomTag1Filters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />
              <FilterDropdown
                label="Custom Tag 2"
                collection="custom_tags_two"
                tagFilters={customTag2Filters}
                toggleTagFilter={(tag) =>
                  setCustomTag2Filters((prev) => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
                }
              />

              {(searchQuery ||
                statusFilter !== "all" ||
                sourceFilters.length > 0 ||
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
                  <TableHead style={{width: '40%'}}>Query</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Follow-up Level</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No calls found.</TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow
                      key={call.id}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleRowClick(call.id)}
                    >
                      <TableCell>{call.name}</TableCell>
                      <TableCell>{call.phone}</TableCell>
                      <TableCell style={{width: '40%'}}>{call.query}</TableCell>
                      <TableCell>{call.source}</TableCell>
                      <TableCell>{call.followup_level}</TableCell>
                      <TableCell>
                        {call.tags?.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Calls Confirmation */}
      {selectedCalls.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Assign Calls</h3>
            <p>You are about to assign {selectedCalls.length} calls to yourself.</p>
            <ul className="mt-2">
              {selectedCalls.map((id) => {
                const call = filteredCalls.find((c) => c.id === id);
                return call && (
                  <li key={id} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {call.name} - {call.phone}
                  </li>
                );
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
  );
}
