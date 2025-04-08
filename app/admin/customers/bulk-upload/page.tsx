"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle, Check, X, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { bulkImportCustomers } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function BulkUploadPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setIsUploading(true)

    // Read file content
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string

        // Parse CSV
        const rows = content.split("\n")
        const headers = rows[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        // Validate headers
        const requiredHeaders = ["Name", "Phone Number", "Email", "Query"]
        const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

        if (missingHeaders.length > 0) {
          toast({
            title: "Invalid CSV format",
            description: `Missing required headers: ${missingHeaders.join(", ")}`,
            variant: "destructive",
          })
          setIsUploading(false)
          return
        }

        // Parse data rows
        const parsedData = rows
          .slice(1)
          .filter((row) => row.trim())
          .map((row, index) => {
            const values = parseCSVRow(row)
            const customer: any = {
              id: index + 1, // Temporary ID for preview
              name: values[headers.indexOf("Name")] || "",
              phoneNumber: values[headers.indexOf("Phone Number")] || "",
              email: values[headers.indexOf("Email")] || "",
              query: values[headers.indexOf("Query")] || "",
              status: values[headers.indexOf("Status")] || "New",
              source: values[headers.indexOf("Source")] || "Bulk Upload",
              followUpLevel: 1,
              tags: {
                course: values[headers.indexOf("Course")] || "",
                subject: values[headers.indexOf("Subject")] || "",
                term: values[headers.indexOf("Term")] || "",
                faculty: values[headers.indexOf("Faculty")] || "",
                custom: values[headers.indexOf("Custom Tags")]
                  ? values[headers.indexOf("Custom Tags")].split(",").map((t: string) => t.trim())
                  : [],
              },
              valid: true,
              errors: [] as string[],
            }

            // Validate required fields
            if (!customer.name) {
              customer.valid = false
              customer.errors.push("Name is required")
            }

            if (!customer.phoneNumber) {
              customer.valid = false
              customer.errors.push("Phone number is required")
            }

            if (!customer.email) {
              customer.valid = false
              customer.errors.push("Email is required")
            } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
              customer.valid = false
              customer.errors.push("Email is invalid")
            }

            if (!customer.query) {
              customer.valid = false
              customer.errors.push("Query is required")
            }

            return customer
          })

        setPreview(parsedData)
        setErrors(parsedData.filter((item) => !item.valid))
        setStep("preview")
        setIsUploading(false)
      } catch (error) {
        toast({
          title: "Error parsing file",
          description: "Please make sure the file is a valid CSV",
          variant: "destructive",
        })
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error reading the file",
        variant: "destructive",
      })
      setIsUploading(false)
    }

    reader.readAsText(uploadedFile)
  }

  // Parse CSV row handling quoted values
  const parseCSVRow = (row: string): string[] => {
    const result = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.replace(/"/g, "").trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.replace(/"/g, "").trim())
    return result
  }

  // Handle import confirmation
  const handleImport = () => {
    // Filter out invalid records
    const validRecords = preview.filter((item) => item.valid)

    if (validRecords.length === 0) {
      toast({
        title: "No valid records",
        description: "There are no valid records to import",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)

    try {
      // Convert to Customer format
      const customersToImport = validRecords.map((item) => ({
        name: item.name,
        phoneNumber: item.phoneNumber,
        email: item.email,
        query: item.query,
        status: item.status,
        source: item.source,
        followUpLevel: item.followUpLevel,
        tags: item.tags,
        assignedTo: localStorage.getItem("userEmail") || "",
      }))

      // Import customers
      const result = bulkImportCustomers(customersToImport)

      // Show toast
      toast({
        title: "Import complete",
        description: `Successfully imported ${result.success.length} customers. ${result.errors.length} errors.`,
      })

      // Move to complete step
      setStep("complete")
    } catch (error) {
      toast({
        title: "Import failed",
        description: error.message || "There was an error importing the customers",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setPreview([])
    setErrors([])
    setStep("upload")
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile)

        // Create a new event with the dropped file
        const event = {
          target: {
            files: [droppedFile],
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        handleFileUpload(event)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
      }
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
        <h1 className="text-3xl font-bold">Bulk Upload Customers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "upload" && (
            <div
              className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Upload a file</h3>
                <p className="text-sm text-muted-foreground">Drag and drop a CSV file, or click to browse.</p>
              </div>
              <Input
                type="file"
                accept=".csv"
                className="max-w-sm"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              <div className="text-xs text-muted-foreground">
                <p>File must include: Name, Phone Number, Email, and Query.</p>
                <p>Optional fields: Status, Source, Course, Subject, Term, Faculty, Custom Tags.</p>
                <p>Maximum file size: 5MB</p>
              </div>
              <div className="mt-4 w-full max-w-md">
                <h4 className="text-sm font-medium mb-2">Sample CSV Format:</h4>
                <div className="bg-muted p-2 rounded-md overflow-x-auto text-xs">
                  <pre>Name,Phone Number,Email,Query,Status,Source,Course,Subject,Term,Faculty,Custom Tags</pre>
                  <pre>
                    John Smith,+1 (555) 123-4567,john@example.com,Interested in CA Final,New,Website,CA
                    Final,Accounts,May 2025,Bhanwar Borana,Scholarship
                  </pre>
                  <pre>
                    Emily Johnson,+1 (555) 234-5678,emily@example.com,Information about CA Inter,New,Referral,CA
                    Inter,Law,Nov 2025,Parveen Sharma,Urgent
                  </pre>
                </div>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Preview Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Review the data before importing. Fix any errors highlighted below.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{file?.name}</Badge>
                  <Badge>{preview.length} records</Badge>
                  <Badge variant="destructive">{errors.length} errors</Badge>
                </div>
              </div>

              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>Please fix the {errors.length} errors before importing.</AlertDescription>
                </Alert>
              )}

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No data to preview
                        </TableCell>
                      </TableRow>
                    ) : (
                      preview.map((item) => (
                        <TableRow key={item.id} className={!item.valid ? "bg-red-50 dark:bg-red-950/20" : ""}>
                          <TableCell>
                            {item.valid ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name || <span className="text-red-500 text-sm">Missing</span>}
                          </TableCell>
                          <TableCell>
                            {item.phoneNumber || <span className="text-red-500 text-sm">Missing</span>}
                          </TableCell>
                          <TableCell>{item.email || <span className="text-red-500 text-sm">Missing</span>}</TableCell>
                          <TableCell>{item.query || <span className="text-red-500 text-sm">Missing</span>}</TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.course && (
                                <Badge variant="outline" className="text-xs">
                                  {item.tags.course}
                                </Badge>
                              )}
                              {item.tags.subject && (
                                <Badge variant="outline" className="text-xs">
                                  {item.tags.subject}
                                </Badge>
                              )}
                              {item.tags.term && (
                                <Badge variant="outline" className="text-xs">
                                  {item.tags.term}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {errors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Error Details</h3>
                  {errors.map((item) => (
                    <Alert key={item.id} variant="destructive">
                      <AlertTitle>
                        Row {item.id}: {item.name || "Unknown"}
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 mt-2">
                          {item.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "complete" && (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Import Complete</h3>
              <p className="text-muted-foreground">
                {preview.filter((item) => item.valid).length} records have been successfully imported.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === "upload" && (
            <div className="flex justify-end w-full">
              <Button disabled={true}>Continue</Button>
            </div>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={errors.length > 0 || preview.filter((item) => item.valid).length === 0 || isImporting}
              >
                {isImporting ? "Importing..." : `Import ${preview.filter((item) => item.valid).length} Records`}
              </Button>
            </>
          )}

          {step === "complete" && (
            <div className="flex justify-end w-full gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/customers">View Customers</Link>
              </Button>
              <Button onClick={handleReset}>Upload Another File</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

