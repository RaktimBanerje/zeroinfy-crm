"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Check, ArrowLeft, Edit, Save, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dummy call details data
const dummyCallDetails = {
  call1: {
    id: "call1",
    name: "Rahul Sharma",
    phoneNumber: "+91 98765 43210",
    query:
      "Interested in CA Final course. Wants to know about the fee structure and study materials. Also inquired about the faculty members teaching the course and their experience. Asked about the success rate of students in previous batches.",
    status: "New",
    source: "Website",
    followUpLevel: "Fresh Call",
    tags: ["CA Final", "Accounts", "May 2025", "Faculty", "Fee Structure", "Study Material"],
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-12T09:15:00Z",
    interactions: [
      {
        id: "int1",
        notes: "Initial inquiry about CA Final course. Customer is interested in the curriculum and pricing.",
        status: "New",
        followUpLevel: "Fresh Call",
        createdAt: "2023-06-10T14:45:00Z",
        createdBy: "staff@example.com",
      },
    ],
  },
  call2: {
    id: "call2",
    name: "Priya Patel",
    phoneNumber: "+91 87654 32109",
    query:
      "Looking for CA Inter coaching. Has questions about the batch timings and faculty. Mentioned that she is currently working part-time and needs a flexible schedule. Prefers weekend batches if available.",
    status: "In Progress",
    source: "Referral",
    followUpLevel: "First Follow-up",
    tags: ["CA Inter", "Law", "Nov 2025", "Weekend Batch", "Flexible Schedule"],
    createdAt: "2023-06-08T11:20:00Z",
    updatedAt: "2023-06-11T14:30:00Z",
    interactions: [
      {
        id: "int2",
        notes: "Customer inquired about CA Inter program details and admission requirements.",
        status: "New",
        followUpLevel: "Fresh Call",
        createdAt: "2023-06-08T11:45:00Z",
        createdBy: "staff@example.com",
      },
      {
        id: "int3",
        notes:
          "Followed up with course details and batch timings. Customer is interested in weekend batches due to work commitments.",
        status: "In Progress",
        followUpLevel: "First Follow-up",
        createdAt: "2023-06-10T09:30:00Z",
        createdBy: "staff@example.com",
      },
    ],
  },
  call3: {
    id: "call3",
    name: "Amit Kumar",
    phoneNumber: "+91 76543 21098",
    query:
      "Wants to enroll for CA Foundation. Needs scholarship information and payment options. Currently in final year of B.Com and planning to start CA preparation immediately after graduation.",
    status: "New",
    source: "Social Media",
    followUpLevel: "Fresh Call",
    tags: ["CA Foundation", "May 2025", "Scholarship", "Payment Options"],
    createdAt: "2023-06-09T15:45:00Z",
    updatedAt: "2023-06-09T15:45:00Z",
    interactions: [
      {
        id: "int4",
        notes: "Initial inquiry about CA Foundation course and scholarship options.",
        status: "New",
        followUpLevel: "Fresh Call",
        createdAt: "2023-06-09T16:00:00Z",
        createdBy: "staff@example.com",
      },
    ],
  },
}

// Available tags for selection
const availableTags = [
  { value: "CA Final", label: "CA Final", category: "Course" },
  { value: "CA Inter", label: "CA Inter", category: "Course" },
  { value: "CA Foundation", label: "CA Foundation", category: "Course" },
  { value: "Accounts", label: "Accounts", category: "Subject" },
  { value: "Law", label: "Law", category: "Subject" },
  { value: "Taxation", label: "Taxation", category: "Subject" },
  { value: "Audit", label: "Audit", category: "Subject" },
  { value: "May 2025", label: "May 2025", category: "Term" },
  { value: "Nov 2025", label: "Nov 2025", category: "Term" },
  { value: "May 2026", label: "May 2026", category: "Term" },
  { value: "Faculty", label: "Faculty", category: "Interest" },
  { value: "Scholarship", label: "Scholarship", category: "Interest" },
  { value: "Fee Structure", label: "Fee Structure", category: "Interest" },
  { value: "Study Material", label: "Study Material", category: "Interest" },
  { value: "Weekend Batch", label: "Weekend Batch", category: "Interest" },
  { value: "Flexible Schedule", label: "Flexible Schedule", category: "Interest" },
  { value: "Payment Options", label: "Payment Options", category: "Interest" },
  { value: "EMI", label: "EMI", category: "Interest" },
  { value: "Transfer", label: "Transfer", category: "Interest" },
  { value: "Exam Pattern", label: "Exam Pattern", category: "Interest" },
  { value: "Batch Start", label: "Batch Start", category: "Interest" },
  { value: "Placement", label: "Placement", category: "Interest" },
]

// Follow-up levels
const followUpLevels = ["Fresh Call", "First Follow-up", "Second Follow-up", "Third Follow-up"]

export default function CallDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<any>(null)
  const [interactions, setInteractions] = useState<any[]>([])
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("")
  const [followUpLevel, setFollowUpLevel] = useState("")
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuery, setEditedQuery] = useState("")
  const [editedTags, setEditedTags] = useState<string[]>([])

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo, we're using dummy data
    const callId = params.id
    const callData = dummyCallDetails[callId]

    if (callData) {
      setCustomer(callData)
      setStatus(callData.status)
      setFollowUpLevel(callData.followUpLevel)
      setInteractions(callData.interactions)
      setEditedQuery(callData.query)
      setEditedTags(callData.tags)

      // Set default follow-up level based on current level
      if (callData.followUpLevel === "Fresh Call") {
        setFollowUpLevel("First Follow-up")
      } else if (callData.followUpLevel === "First Follow-up") {
        setFollowUpLevel("Second Follow-up")
      } else if (callData.followUpLevel === "Second Follow-up") {
        setFollowUpLevel("Third Follow-up")
      } else {
        setFollowUpLevel(callData.followUpLevel)
      }
    } else {
      // Call not found, redirect to calls page
      router.push("/staff/calls")
    }
  }, [params.id, router])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!notes) {
      toast({
        title: "Error",
        description: "Please enter notes for this interaction",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would send to an API
      // For demo, we're just updating the local state
      const newInteraction = {
        id: `int${interactions.length + 1}`,
        notes,
        status,
        followUpLevel,
        nextFollowUpDate: nextFollowUpDate ? nextFollowUpDate.toISOString() : null,
        createdAt: new Date().toISOString(),
        createdBy: "staff@example.com",
      }

      // Update interactions
      const updatedInteractions = [newInteraction, ...interactions]
      setInteractions(updatedInteractions)

      // Update customer status
      setCustomer({
        ...customer,
        status,
        followUpLevel,
        nextFollowUpDate: nextFollowUpDate ? nextFollowUpDate.toISOString() : null,
        updatedAt: new Date().toISOString(),
      })

      // Reset form
      setNotes("")

      toast({
        title: "Success",
        description: "Interaction added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add interaction",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = () => {
    setCustomer({
      ...customer,
      query: editedQuery,
      tags: editedTags,
      updatedAt: new Date().toISOString(),
    })
    setIsEditing(false)

    toast({
      title: "Success",
      description: "Customer information updated successfully",
    })
  }

  const handleTagSelect = (tag: string) => {
    if (editedTags.includes(tag)) {
      setEditedTags(editedTags.filter((t) => t !== tag))
    } else {
      setEditedTags([...editedTags, tag])
    }
  }

  if (!customer) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push("/staff/calls")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    )
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

  // Get follow-up level color
  const getFollowUpLevelColor = (level) => {
    switch (level) {
      case "Fresh Call":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "First Follow-up":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Second Follow-up":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Third Follow-up":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/staff/calls")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Call Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-blue-500" style={{backgroundColor: '#f1f1f1'}}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Details about the customer and their query</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{customer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                      <Badge className={getFollowUpLevelColor(customer.followUpLevel)}>{customer.followUpLevel}</Badge>
                      <Badge variant="outline">{customer.source}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {customer.phoneNumber}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Query</h4>
                  {isEditing ? (
                    <Textarea
                      value={editedQuery}
                      onChange={(e) => setEditedQuery(e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm">{customer.query}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {editedTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0"
                              onClick={() => setEditedTags(editedTags.filter((t) => t !== tag))}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Add Tags
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Manage Tags</DialogTitle>
                            <DialogDescription>
                              Select tags from different categories to add to this customer.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {/* Course Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="course">Course</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="course" className="w-full">
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search course..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Course")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Term Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="term">Term</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="term" className="w-full">
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search term..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Term")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Subject Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="subject" className="w-full">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search subject..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Subject")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Interest Tags */}
                            <div className="grid gap-2">
                              <Label htmlFor="interest">Interest</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="interest" className="w-full">
                                  <SelectValue placeholder="Select interest" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search interest..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Interest")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditedTags([])}>
                              Clear All Tags
                            </Button>
                            <DialogClose asChild>
                              <Button type="button">Done</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => {
                        // Get tag category
                        const tagInfo = availableTags.find((t) => t.value === tag)
                        const category = tagInfo?.category || "Other"

                        // Get color based on category
                        let colorClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        if (category === "Course") {
                          colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        } else if (category === "Subject") {
                          colorClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        } else if (category === "Term") {
                          colorClass = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        } else if (category === "Interest") {
                          colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }

                        return (
                          <Badge key={index} className={colorClass}>
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSaveEdit}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500" style={{backgroundColor: '#f1f1f1'}}>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
              <CardDescription>Previous interactions with this customer</CardDescription>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No interactions yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {interactions.map((interaction, index) => (
                    <div key={interaction.id} className="relative pl-6 pb-6">
                      {index < interactions.length - 1 && (
                        <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-muted" />
                      )}
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(interaction.status)}>{interaction.status}</Badge>
                          <Badge className={getFollowUpLevelColor(interaction.followUpLevel)}>
                            {interaction.followUpLevel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(interaction.createdAt)} at {formatTime(interaction.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-2">{interaction.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-l-4 border-l-yellow-500 sticky top-6" style={{backgroundColor: '#f1f1f1'}}>
            <CardHeader>
              <CardTitle>Add Interaction</CardTitle>
              <CardDescription>Update the customer's status and add notes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Follow-up Level</label>
                  <Select value={followUpLevel} onValueChange={setFollowUpLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select follow-up level" />
                    </SelectTrigger>
                    <SelectContent>
                      {followUpLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Next Follow-up Date & Time</label>
                  <div className="relative">
                  <input
                    type="datetime-local"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={nextFollowUpDate ? nextFollowUpDate.toISOString().slice(0, 16) : ""}
                    onChange={(e) => setNextFollowUpDate(e.target.value ? new Date(e.target.value) : undefined)}
                    min={new Date().toISOString().slice(0, 16)} // Ensures the minimum is the current date and time
                  />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes about this interaction"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Interaction"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

