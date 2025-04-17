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

import Course from '../../../components/Course'
import CustomTagOne from '../../../components/CustomTagOne'
import CustomTagTwo from '../../../components/CustomTagTwo'
import FollowUpLevel from '../../../components/FollowUpLevel'
import Source from '../../../components/Source'
import Subject from '../../../components/Subject'
import Term from '../../../components/Term'

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

    // if (!form.source) {
    //   newErrors.source = "Source is required"
    // }

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
      console.log(form)


      // const userEmail = localStorage.getItem("userEmail") || ""

      // const newCustomer = addCustomer({
      //   ...form,
      //   assignedTo: userEmail,
      // })



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
        <Link href="/staff/dashboard">
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
                <Source />
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
                  <Course />
                </div>

                <div className="space-y-2">
                  <Subject />
                </div>

                <div className="space-y-2">
                  <Term />
                </div>

                <div className="space-y-2">
                
                </div>

                <div className="space-y-2">
                  <CustomTagOne />
                </div>

                <div className="space-y-2">
                  <CustomTagTwo />
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

