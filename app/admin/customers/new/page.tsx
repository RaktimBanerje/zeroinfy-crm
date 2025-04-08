"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { addCustomer, getSources, getTagsByType, getDependentTags } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    query: "",
    source: "",
    status: "New",
    followUpLevel: 1,
    tags: {
      course: "",
      subject: "",
      term: "",
      faculty: "",
      custom: [] as string[],
    },
  })
  const [newCustomTag, setNewCustomTag] = useState("")
  const [sources, setSources] = useState<{ id: string; name: string }[]>([])
  const [courseTags, setCourseTags] = useState<{ id: string; name: string }[]>([])
  const [subjectTags, setSubjectTags] = useState<{ id: string; name: string }[]>([])
  const [termTags, setTermTags] = useState<{ id: string; name: string }[]>([])
  const [facultyTags, setFacultyTags] = useState<{ id: string; name: string }[]>([])
  const [customTags, setCustomTags] = useState<{ id: string; name: string }[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load sources and tags
    setSources(getSources())
    setCourseTags(getTagsByType("course"))
    setTermTags(getTagsByType("term"))
    setFacultyTags(getTagsByType("faculty"))
    setCustomTags(getTagsByType("custom"))
  }, [])

  // Handle form change
  const handleFormChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle tag change
  const handleTagChange = (type: string, value: string) => {
    setForm((prev) => ({
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
        if (form.tags.subject && !subjects.some((tag) => tag.name === form.tags.subject)) {
          setForm((prev) => ({
            ...prev,
            tags: {
              ...prev.tags,
              subject: "",
            },
          }))
        }
      } else {
        setSubjectTags([])
        setForm((prev) => ({
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
    if (newCustomTag && !form.tags.custom.includes(newCustomTag)) {
      setForm((prev) => ({
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
    setForm((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        custom: prev.tags.custom.filter((t) => t !== tag),
      },
    }))
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!form.query.trim()) {
      newErrors.query = "Query is required"
    }

    if (!form.source) {
      newErrors.source = "Source is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    try {
      // Add customer
      const userEmail = localStorage.getItem("userEmail") || ""

      const newCustomer = addCustomer({
        ...form,
        assignedTo: userEmail,
      })

      toast({
        title: "Customer Added",
        description: "Customer has been added successfully",
      })

      // Redirect to customer details
      router.push(`/admin/customers/${newCustomer.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
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
        <h1 className="text-3xl font-bold">Add New Customer</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">
                  Source <span className="text-red-500">*</span>
                </Label>
                <Select value={form.source} onValueChange={(value) => handleFormChange("source", value)}>
                  <SelectTrigger id="source" className={errors.source ? "border-red-500" : ""}>
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
                {errors.source && <p className="text-xs text-red-500">{errors.source}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="query">
                Query <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="query"
                value={form.query}
                onChange={(e) => handleFormChange("query", e.target.value)}
                className={errors.query ? "border-red-500" : ""}
              />
              {errors.query && <p className="text-xs text-red-500">{errors.query}</p>}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Tags</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select value={form.tags.course} onValueChange={(value) => handleTagChange("course", value)}>
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
                    value={form.tags.subject}
                    onValueChange={(value) => handleTagChange("subject", value)}
                    disabled={!form.tags.course || subjectTags.length === 0}
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
                  <Select value={form.tags.term} onValueChange={(value) => handleTagChange("term", value)}>
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
                  <Select value={form.tags.faculty} onValueChange={(value) => handleTagChange("faculty", value)}>
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

              <div className="mt-4 space-y-2">
                <Label>Custom Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.custom.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full p-0"
                        onClick={() => handleRemoveCustomTag(tag)}
                        type="button"
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/customers">Cancel</Link>
            </Button>
            <Button type="submit">Add Customer</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

