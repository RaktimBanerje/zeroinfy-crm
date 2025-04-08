"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, Edit, Mail, MessageSquare, Phone, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock data for the call details
const callDetails = {
  id: 1,
  customerName: "John Smith",
  phoneNumber: "+1 (555) 123-4567",
  email: "john.smith@example.com",
  query: "Interested in Data Science course",
  status: "In Progress",
  source: "Website",
  followUpLevel: 2,
  tags: ["Data Science", "Spring Term", "Engineering"],
  createdAt: "2023-06-10T14:30:00Z",
  updatedAt: "2023-06-12T09:15:00Z",
  assignedTo: "Jane Doe",
  notes: [
    {
      id: 1,
      text: "Initial inquiry about Data Science course. Customer is interested in the curriculum and pricing.",
      createdBy: "Jane Doe",
      createdAt: "2023-06-10T14:45:00Z",
    },
    {
      id: 2,
      text: "Followed up with course details and pricing information. Customer requested more information about job placement rates.",
      createdBy: "Jane Doe",
      createdAt: "2023-06-11T10:30:00Z",
    },
  ],
}

export default function CallDetails() {
  const [status, setStatus] = useState(callDetails.status)
  const [followUpLevel, setFollowUpLevel] = useState(callDetails.followUpLevel.toString())
  const [newNote, setNewNote] = useState("")

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

  // Handle status change
  const handleStatusChange = (value) => {
    setStatus(value)
  }

  // Handle follow-up level change
  const handleFollowUpLevelChange = (value) => {
    setFollowUpLevel(value)
  }

  // Handle note submission
  const handleNoteSubmit = (e) => {
    e.preventDefault()
    if (newNote.trim()) {
      // In a real app, you would send this to your API
      console.log("New note:", newNote)
      setNewNote("")
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Closed":
        return "bg-green-100 text-green-800"
      case "Sold":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{callDetails.customerName}</h1>
            <p className="text-muted-foreground">Call ID: #{callDetails.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>{status}</Badge>
            <Badge variant="outline">Level {followUpLevel}</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes & History</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label>Query</Label>
                      <p className="text-sm">{callDetails.query}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Source</Label>
                      <p className="text-sm">{callDetails.source}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Created At</Label>
                      <p className="text-sm">
                        {formatDate(callDetails.createdAt)} at {formatTime(callDetails.createdAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Last Updated</Label>
                      <p className="text-sm">
                        {formatDate(callDetails.updatedAt)} at {formatTime(callDetails.updatedAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Assigned To</Label>
                      <p className="text-sm">{callDetails.assignedTo}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {callDetails.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6">
                        <Plus className="mr-1 h-3 w-3" />
                        Add Tag
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-6">
                  <div className="space-y-4">
                    {callDetails.notes.map((note) => (
                      <div key={note.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {note.createdBy
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{note.createdBy}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(note.createdAt)}</span>
                            <Clock className="ml-2 h-3 w-3" />
                            <span>{formatTime(note.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-sm">{note.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-note">Add Note</Label>
                      <Textarea
                        id="new-note"
                        placeholder="Type your note here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-muted-foreground">No tasks assigned for this call.</p>
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {callDetails.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{callDetails.customerName}</h3>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{callDetails.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{callDetails.email}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <User className="mr-2 h-4 w-4" />
                View Customer Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status">
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
                <Label htmlFor="followup">Follow-up Level</Label>
                <Select value={followUpLevel} onValueChange={handleFollowUpLevelChange}>
                  <SelectTrigger id="followup">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Call
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

