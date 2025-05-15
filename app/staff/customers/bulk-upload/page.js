"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Papa from "papaparse"
import axios from "axios"

export default function BulkUploadPage() {
  const { toast } = useToast()
  const [file, setFile] = useState(null)
  const [step, setStep] = useState("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [failedLeads, setFailedLeads] = useState([])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadStatus(null)
      setFailedLeads([]) // Clear failed leads
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleContinueUpload = () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus("Uploading...")

    Papa.parse(file, {
      header: true,
      complete: async (result) => {
        const csvData = result.data
        let importFailed = false
        let failedLeads = []

        for (let row of csvData) {
          const fallbackFollowup = row.Followup && row.Followup.trim() !== "" ? row.Followup.trim() : "Fresh Call";
          
          console.log([
              ...(row.Source ? [row.Source.trim()] : []),
              fallbackFollowup,
              ...(typeof row.Tags === "string"
                ? row.Tags.split(",").map(tag => tag.trim()).filter(Boolean)
                : [])
          ])

          const leadData = {
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            query: row.Query,
            source: row.Source,
            followup_level: fallbackFollowup,
            tags: [
              ...(row.Source ? [row.Source.trim()] : []),
              fallbackFollowup,
              ...(typeof row.Tags === "string"
                ? row.Tags.split(",").map(tag => tag.trim()).filter(Boolean)
                : [])
            ]
          };

          try {
            const response = await axios.post("https://zeroinfy.thinksurfmedia.in/items/leads", leadData)

            if (response.status !== 200) {
              throw new Error(`Failed to import lead: ${row.Name} (${row.Phone})`)
            }
          } catch (error) {
            const errorResponse = error.response?.data
            if (errorResponse && errorResponse.errors) {
              // Check if the error is a duplicate entry
              const duplicateError = errorResponse.errors.find(e => e.extensions?.code === "RECORD_NOT_UNIQUE")
              if (duplicateError) {
                // Collect the name and phone of the failed lead
                failedLeads.push({
                  name: row.Name,
                  phone: row.Phone,
                  error: 'Upload failed due to duplicate entry',
                })
                importFailed = true
              }
            }
            console.error("Error adding lead:", error)
          }
        }

        if (importFailed) {
          setFailedLeads(failedLeads) // Set failed leads state
          setUploadStatus(`Upload failed due to duplicate entries for ${failedLeads.length} leads.`)
          setStep("error")
        } else {
          setUploadStatus("Upload and import completed.")
          setStep("complete")
        }

        setIsUploading(false)
      },
      error: (err) => {
        toast({
          title: "Parsing error",
          description: err.message,
          variant: "destructive",
        })
        setIsUploading(false)
      },
    })
  }

  const handleReset = () => {
    setFile(null)
    setUploadStatus(null)
    setStep("upload")
    setFailedLeads([]) // Reset failed leads on reset
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
        <h1 className="text-3xl font-bold">Bulk Upload Customers</h1>
      </div>

      <Card>
        <CardContent>
          {step === "upload" && (
            <div
              className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-center">Upload a file</h3>
              <p className="text-sm text-muted-foreground text-center">
                Drag and drop a CSV file, or click to browse.
              </p>
              <Input
                type="file"
                accept=".csv"
                className="max-w-sm"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              {uploadStatus && <p className="text-sm text-muted-foreground">{uploadStatus}</p>}
              <div className="text-xs text-muted-foreground mt-2">
                <p>File must include: name, phone, email, query.</p>
                <p>Optional: course, subject, term, faculty, custom tags.</p>
              </div>
            </div>
          )}

          {step === "complete" && (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Import Complete</h3>
              <p className="text-muted-foreground">Your CSV data has been successfully imported.</p>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center justify-center space-y-4 p-10 text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                <ArrowLeft className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold">Import Failed</h3>
              <p className="text-muted-foreground">
                The following leads failed to import due to duplicate entries:
              </p>
              <ul className="list-inside text-sm text-red-600" style={{textAlign: 'left'}}>
                {failedLeads.map((lead, index) => (
                  <li key={index} style={{marginBottom: 10}}>
                    {lead.name} ({lead.phone}): {lead.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step === "upload" && (
            <Button onClick={handleContinueUpload} disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Continue"}
            </Button>
          )}
          {step === "complete" && (
            <div className="flex justify-end w-full gap-2">
              <Button onClick={handleReset}>Upload Another File</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
