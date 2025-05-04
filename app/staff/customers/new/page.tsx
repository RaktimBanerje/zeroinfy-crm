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
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Select from "react-select"
import axios from "axios"
import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    query: "",
    source: "",
    status: "New",
    followUpLevel: 1,
    tags: [], // ✅ flat array of selected tags
  })

  const [errors, setErrors] = useState({})
  const [dropdownOptions, setDropdownOptions] = useState({
    courses: [],
    subjects: [],
    terms: [],
    faculties: [],
    custom_tags_one: [],
    custom_tags_two: [],
    sources: [],
  })

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const [courses, subjects, terms, faculties, customOne, customTwo, sources] = await Promise.all([
          directus.request(readItems("courses")),
          directus.request(readItems("subjects")),
          directus.request(readItems("terms")),
          directus.request(readItems("faculties")),
          directus.request(readItems("custom_tags_one")),
          directus.request(readItems("custom_tags_two")),
          directus.request(readItems("sources")),
        ])

        setDropdownOptions({
          courses: courses,
          subjects: subjects,
          terms: terms,
          faculties: faculties,
          custom_tags_one: customOne,
          custom_tags_two: customTwo,
          sources: sources,
        })
      } catch (err) {
        console.error("Error fetching tag options:", err)
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

  const handleMultiSelect = (selectedOptions, collectionName) => {
    const selectedValues = selectedOptions.map((option) => option.value)
    setForm((prev) => ({
      ...prev,
      tags: [
        ...new Set([
          ...prev.tags.filter((tag) => !dropdownOptions[collectionName].some((opt) => opt.id.toString() === tag)),
          ...selectedValues,
        ]),
      ],
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"
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
      const payload = {
        ...form,
        tags: form.tags, // already flat array of tag values
      }

      console.log(payload)

      await axios.post("https://zeroinfy.thinksurfmedia.in/items/leads", payload)
      
      router.push("/staff/dashboard")

    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const dropdownFields = [
    { label: "Course", name: "courses" },
    { label: "Subject", name: "subjects" },
    { label: "Term", name: "terms" },
    { label: "Faculty", name: "faculties" },
    { label: "Custom Tag 1", name: "custom_tags_one" },
    { label: "Custom Tag 2", name: "custom_tags_two" },
  ]

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
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <Label>Source</Label>
                <select
                  className="w-full border rounded p-2"
                  value={form.source}
                  onChange={(e) => handleFormChange("source", e.target.value)}
                >
                  <option value="">Select source</option>
                  {dropdownOptions.sources.map((source) => (
                    <option key={source.id} value={source.name}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Query *</Label>
              <Textarea
                value={form.query}
                onChange={(e) => handleFormChange("query", e.target.value)}
                className={errors.query ? "border-red-500" : ""}
              />
              {errors.query && <p className="text-xs text-red-500">{errors.query}</p>}
            </div>

            <Separator />

            <h3 className="text-lg font-medium mb-4">Tags (Multi-select)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dropdownFields.map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Select
                    isMulti
                    options={dropdownOptions[field.name]?.map((item) => ({
                      label: item.name,
                      value: item.name,
                    }))}
                    onChange={(selected) => handleMultiSelect(selected, field.name)}
                  />
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
