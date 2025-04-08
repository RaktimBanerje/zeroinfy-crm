"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BulkUpload() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState([])
  const [errors, setErrors] = useState([])
  const [step, setStep] = useState("upload") // upload, preview, complete

  // Mock function to handle file upload
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile) {
      setFile(uploadedFile)

      // Mock preview data
      const mockPreviewData = [
        {
          id: 1,
          customerName: "John Smith",
          phoneNumber: "+1 (555) 123-4567",
          email: "john.smith@example.com",
          query: "Interested in Data Science course",
          status: "New",
          source: "Website",
          followUpLevel: 1,
          tags: ["Data Science", "Spring Term", "Engineering"],
          valid: true,
          errors: [],
        },
        {
          id: 2,
          customerName: "Emily Johnson",
          phoneNumber: "+1 (555) 234-5678",
          email: "emily.johnson@example.com",
          query: "Information about MBA program",
          status: "New",
          source: "Referral",
          followUpLevel: 1,
          tags: ["MBA", "Fall Term", "Business"],
          valid: true,
          errors: [],
        },
        {
          id: 3,
          customerName: "Michael Brown",
          phoneNumber: "",
          email: "michael.brown@example.com",
          query: "Pricing for Computer Science degree",
          status: "New",
          source: "Social Media",
          followUpLevel: 1,
          tags: ["Computer Science", "Fall Term", "Engineering"],
          valid: false,
          errors: ["Phone number is required"],
        },
        {
          id: 4,
          customerName: "Sarah Davis",
          phoneNumber: "+1 (555) 456-7890",
          email: "sarah.davis@example.com",
          query: "",
          status: "New",
          source: "Email Campaign",
          followUpLevel: 1,
          tags: ["Psychology", "Winter Term", "Arts"],
          valid: false,
          errors: ["Query is required"],
        },
        {
          id: 5,
          customerName: "David Wilson",
          phoneNumber: "+1 (555) 567-8901",
          email: "david.wilson@example.com",
          query: "Scholarship opportunities for Engineering",
          status: "New",
          source: "Phone Inquiry",
          followUpLevel: 1,
          tags: ["Engineering", "Spring Term", "Scholarship"],
          valid: true,
          errors: [],
        },
      ]

      setPreview(mockPreviewData)
      setErrors(mockPreviewData.filter((item) => !item.valid))
      setStep("preview")
    }
  }

  // Handle import confirmation
  const handleImport = () => {
    // Filter out invalid records
    const validRecords = preview.filter((item) => item.valid)

    // In a real app, you would send these to your API
    console.log("Importing valid records:", validRecords)

    // Move to complete step
    setStep("complete")
  }

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setPreview([])
    setErrors([])
    setStep("upload")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "upload" && (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Upload a file</h3>
                <p className="text-sm text-muted-foreground">Drag and drop a CSV or Excel file, or click to browse.</p>
              </div>
              <Input type="file" accept=".csv,.xlsx,.xls" className="max-w-sm" onChange={handleFileUpload} />
              <div className="text-xs text-muted-foreground">
                <p>File must include: Customer Name, Phone Number, Email, and Query.</p>
                <p>Maximum file size: 5MB</p>
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

              <div className="rounded-md border">
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
                    {preview.map((item) => (
                      <TableRow key={item.id} className={!item.valid ? "bg-red-50" : ""}>
                        <TableCell>
                          {item.valid ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.customerName}</TableCell>
                        <TableCell>
                          {item.phoneNumber || <span className="text-red-500 text-sm">Missing</span>}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.query || <span className="text-red-500 text-sm">Missing</span>}</TableCell>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
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
              <Button disabled>Continue</Button>
            </div>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={errors.length > 0}>
                Import {preview.filter((item) => item.valid).length} Records
              </Button>
            </>
          )}

          {step === "complete" && (
            <div className="flex justify-end w-full">
              <Button onClick={handleReset}>Upload Another File</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

