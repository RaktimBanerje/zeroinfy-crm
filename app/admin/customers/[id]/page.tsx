"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Edit, Mail, MessageSquare, Phone, Plus, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  type Customer,
  type Interaction,
  getCustomerById,
  getInteractionsByCustomerId,
  addInteraction,
  updateCustomer,
  deleteCustomer,
  getSources,
  getTagsByType,
  getDependentTags,
} from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function CustomerDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [interactions, setInteractions] = useState<Interaction[]>([])
  const [newNote, setNewNote] = useState("")
  const [status, setStatus] = useState<Customer["status"]>("New")
  const [followUpLevel, setFollowUpLevel] = useState<string>("1")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    query: "",
    source: "",
    tags: {
      course: "",
      subject: "",
      term: "",
      faculty: "",
      custom: [] as string[],
    },
  })
  const [sources, setSources] = useState<{ id: string; name: string }[]>([])
  const [courseTags, setCourseTags] = useState<{ id: string; name: string }[]>([])
  const [subjectTags, setSubjectTags] = useState<{ id: string; name: string }[]>([])
  const [termTags, setTermTags] = useState<{ id: string; name: string }[]>([])
  const [facultyTags, setFacultyTags] = useState<{ id: string; name: string }[]>([])
  const [customTags, setCustomTags] = useState<{ id: string; name: string }[]>([])
  const [newCustomTag, setNewCustomTag] = useState("")

  useEffect(() => {
    // Load customer data
    const customerData = getCustomerById(params.id)
    if (customerData) {
      setCustomer(customerData)
      setStatus(customerData.status)
      setFollowUpLevel(customerData.followUpLevel.toString())

      // Set edit form data
      setEditForm({
        name: customerData.name,
        phoneNumber: customerData.phoneNumber,
        email: customerData.email,
        query: customerData.query,
        source: customerData.source,
        tags: {
          course: customerData.tags.course || "",
          subject: customerData.tags.subject || "",
          term: customerData.tags.term || "",
          faculty: customerData.tags.faculty || "",
          custom: customerData.tags.custom || [],
        },
      })

      // Load interactions
      const customerInteractions = getInteractionsByCustomerId(params.id)
      setInteractions(customerInteractions)

      // Load sources and tags
      setSources(getSources())
      setCourseTags(getTagsByType("course"))
      setTermTags(getTagsByType("term"))
      setFacultyTags(getTagsByType("faculty"))
      setCustomTags(getTagsByType("custom"))

      // Load subject tags based on selected course
      if (customerData.tags.course) {
        const courseTag = getTagsByType("course").find((tag) => tag.name === customerData.tags.course)
        if (courseTag) {
          setSubjectTags(getDependentTags(courseTag.id))
        }
      }
    } else {
      // Customer not found, redirect to customers list
      router.push("/admin/customers")
    }
  }, [params.id, router])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Handle status change
  const handleStatusChange = (value: string) => {
    setStatus(value as Customer["status"])

    if (customer) {
      // Update customer status
      const updatedCustomer = updateCustomer(customer.id, {
        status: value as Customer["status"],
      })
      setCustomer(updatedCustomer)

      toast({
        title: "Status updated",
        description: `Customer status updated to ${value}`,
      })
    }
  }

  // Handle follow-up level change
  const handleFollowUpLevelChange = (value: string) => {
    setFollowUpLevel(value)

    if (customer) {
      // Update customer follow-up level
      const updatedCustomer = updateCustomer(customer.id, {
        followUpLevel: Number.parseInt(value) as 1 | 2 | 3 | 4,
      })
      setCustomer(updatedCustomer)

      toast({
        title: "Follow-up level updated",
        description: `Customer follow-up level updated to ${value}`,
      })
    }
  }

  // Handle note submission
  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (customer && newNote.trim()) {
      // Add new interaction
      const userEmail = localStorage.getItem("userEmail") || ""

      const newInteraction = addInteraction({
        customerId: customer.id,
        notes: newNote,
        status,
        followUpLevel: Number.parseInt(followUpLevel) as 1 | 2 | 3 | 4,
        createdBy: userEmail,
      })

      // Update interactions list
      setInteractions([newInteraction, ...interactions])

      // Clear note input
      setNewNote("")

      toast({
        title: "Note added",
        description: "Your note has been added successfully",
      })
    }
  }

  // Handle edit form change
  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle tag change
  const handleTagChange = (type: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [type]: value,
      },
    }))

    // If changing course, update subject options
    if (type === "course") {
      const courseTag = courseTags.find((tag) => tag.name === value)
      if (courseTag) {
        const subjects = getDependentTags(courseTag.id)
        setSubjectTags(subjects)

        // Clear subject if not available in new course
        if (editForm.tags.subject && !subjects.some((tag) => tag.name === editForm.tags.subject)) {
          setEditForm((prev) => ({
            ...prev,
            tags: {
              ...prev.tags,
              subject: "",
            },
          }))
        }
      } else {
        setSubjectTags([])
        setEditForm((prev) => ({
          ...prev,
          tags: {
            ...prev.tags,
            subject: "",
          },
        }))
      }
    }
  }

  // Handle custom tag add
  const handleAddCustomTag = () => {
    if (newCustomTag && !editForm.tags.custom.includes(newCustomTag)) {
      setEditForm((prev) => ({
        ...prev,
        tags: {
          ...prev.tags,
          custom: [...prev.tags.custom, newCustomTag],
        },
      }))
      setNewCustomTag("")
    }
  }

  // Handle custom tag remove
  const handleRemoveCustomTag = (tag: string) => {
    setEditForm((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        custom: prev.tags.custom.filter((t) => t !== tag),
      },
    }))
  }

  // Handle edit form submit
  const handleEditSubmit = () => {
    if (customer) {
      // Update customer
      const updatedCustomer = updateCustomer(customer.id, {
        name: editForm.name,
        phoneNumber: editForm.phoneNumber,
        email: editForm.email,
        query: editForm.query,
        source: editForm.source,
        tags: editForm.tags,
      })

      setCustomer(updatedCustomer)
      setIsEditDialogOpen(false)

      toast({
        title: "Customer updated",
        description: "Customer information has been updated successfully",
      })
    }
  }

  // Handle customer delete
  const handleDeleteCustomer = () => {
    if (customer) {
      deleteCustomer(customer.id)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Customer deleted",
        description: "Customer has been deleted successfully",
      })

      // Redirect to customers list
      router.push("/admin/customers")
    }
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

  if (!customer) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-full">
          <p>Loading customer information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="mb-6">
        <Link href="/admin/customers">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer ID: #{customer.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>{status}</Badge>
            <Badge variant="outline">Level {followUpLevel}</Badge>
            <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>View and manage customer details.</CardDescription>
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
                      <p className="text-sm">{customer.query}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Source</Label>
                      <p className="text-sm">{customer.source}</p>
                    </div>
                    <div className="space-y-1">
                      <Label>Created At</Label>
                      <p className="text-sm">
                        {formatDate(customer.createdAt)} at {formatTime(customer.createdAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Last Updated</Label>
                      <p className="text-sm">
                        {formatDate(customer.updatedAt)} at {formatTime(customer.updatedAt)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label>Assigned To</Label>
                      <p className="text-sm">{customer.assignedTo || "Not assigned"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="mb-2 block">Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.course && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200"
                        >
                          Course: {customer.tags.course}
                        </Badge>
                      )}
                      {customer.tags.subject && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"
                        >
                          Subject: {customer.tags.subject}
                        </Badge>
                      )}
                      {customer.tags.term && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200"
                        >
                          Term: {customer.tags.term}
                        </Badge>
                      )}
                      {customer.tags.faculty && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200"
                        >
                          Faculty: {customer.tags.faculty}
                        </Badge>
                      )}
                      {customer.tags.custom &&
                        customer.tags.custom.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 hover:bg-pink-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-6">
                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-note">Add Note</Label>
                      <Textarea
                        id="new-note"
                        placeholder="Type your note here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full sm:w-1/2">
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
                      <div className="w-full sm:w-1/2">
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
                    </div>
                    <Button type="submit" disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </form>

                  <Separator />

                  <div className="space-y-4">
                    {interactions.length === 0 ? (
                      <p className="text-center text-muted-foreground">No interaction history yet.</p>
                    ) : (
                      interactions.map((interaction) => (
                        <div key={interaction.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{interaction.createdBy.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{interaction.createdBy}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(interaction.createdAt)}</span>
                              <Clock className="ml-2 h-3 w-3" />
                              <span>{formatTime(interaction.createdAt)}</span>
                            </div>
                          </div>
                          <p className="text-sm">{interaction.notes}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Badge className={getStatusColor(interaction.status)}>{interaction.status}</Badge>
                            <Badge variant="outline">Level {interaction.followUpLevel}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-6">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-muted-foreground">No tasks assigned for this customer.</p>
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
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Actions</CardTitle>
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
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Customer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information and tags.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={editForm.name} onChange={(e) => handleEditFormChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleEditFormChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={editForm.source} onValueChange={(value) => handleEditFormChange("source", value)}>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source.id} value={source.name}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="query">Query</Label>
              <Textarea
                id="query"
                value={editForm.query}
                onChange={(e) => handleEditFormChange("query", e.target.value)}
              />
            </div>
            <Separator />
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select value={editForm.tags.course} onValueChange={(value) => handleTagChange("course", value)}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {courseTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={editForm.tags.subject}
                  onValueChange={(value) => handleTagChange("subject", value)}
                  disabled={!editForm.tags.course || subjectTags.length === 0}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {subjectTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Select value={editForm.tags.term} onValueChange={(value) => handleTagChange("term", value)}>
                  <SelectTrigger id="term">
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {termTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Select value={editForm.tags.faculty} onValueChange={(value) => handleTagChange("faculty", value)}>
                  <SelectTrigger id="faculty">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {facultyTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.name}>
                        {tag.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Custom Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editForm.tags.custom.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => handleRemoveCustomTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom tag"
                  value={newCustomTag}
                  onChange={(e) => setNewCustomTag(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddCustomTag} disabled={!newCustomTag}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

