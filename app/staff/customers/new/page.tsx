"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"
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
    course: "",
    subject: "",
    term: "",
    faculty: "",
    customOne: "",
    customTwo: "",
  })

  const [errors, setErrors] = useState({})
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [terms, setTerms] = useState([])
  const [faculties, setFaculties] = useState([])
  const [customTagsOne, setCustomTagsOne] = useState([])
  const [customTagsTwo, setCustomTagsTwo] = useState([])
  const [sources, setSources] = useState([])

  useEffect(() => {
    async function fetchTags() {
      try {
        const [coursesRes, subjectsRes, termsRes, facultiesRes, customOneRes, customTwoRes, sourcesRes] =
          await Promise.all([
            directus.request(readItems("courses")),
            directus.request(readItems("subjects")),
            directus.request(readItems("terms")),
            directus.request(readItems("faculties")),
            directus.request(readItems("custom_tags_one")),
            directus.request(readItems("custom_tags_two")),
            directus.request(readItems("sources")),
          ])

        setCourses(coursesRes.data || [])
        setSubjects(subjectsRes.data || [])
        setTerms(termsRes.data || [])
        setFaculties(facultiesRes.data || [])
        setCustomTagsOne(customOneRes.data || [])
        setCustomTagsTwo(customTwoRes.data || [])
        setSources(sourcesRes.data || [])
      } catch (err) {
        console.error("Error fetching tags:", err)
      }
    }

    fetchTags()
  }, [])

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid"
    if (!form.query.trim()) newErrors.query = "Query is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
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
      const response = await axios.post(
        "http://zeroinfy.thinksurfmedia.in:8055/items/leads",
        form
      )

      toast({
        title: "Success",
        description: "Lead added successfully!",
      })

      router.push("/admin/customers")
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <Link href="/staff/dashboard">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Name <span className="text-red-500">*</span></Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label>Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => handleFormChange("phoneNumber", e.target.value)}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div>
                <Label>Email <span className="text-red-500">*</span></Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <Label>Source</Label>
                <Select value={form.source} onValueChange={(value) => handleFormChange("source", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source.id} value={source.id.toString()}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Query <span className="text-red-500">*</span></Label>
              <Textarea
                value={form.query}
                onChange={(e) => handleFormChange("query", e.target.value)}
                className={errors.query ? "border-red-500" : ""}
              />
              {errors.query && <p className="text-xs text-red-500">{errors.query}</p>}
            </div>

            <Separator />

            <h3 className="text-lg font-medium mb-4">Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Course", name: "course", options: courses },
                { label: "Subject", name: "subject", options: subjects },
                { label: "Term", name: "term", options: terms },
                { label: "Faculty", name: "faculty", options: faculties },
                { label: "Custom Tag 1", name: "customOne", options: customTagsOne },
                { label: "Custom Tag 2", name: "customTwo", options: customTagsTwo },
              ].map((tag) => (
                <div key={tag.name}>
                  <Label>{tag.label}</Label>
                  <Select
                    value={form[tag.name]}
                    onValueChange={(value) => handleFormChange(tag.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${tag.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {tag.options.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id.toString()}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
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
