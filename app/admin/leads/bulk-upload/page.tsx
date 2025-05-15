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

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadStatus(null)
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

        for (let row of csvData) {
          const leadData = {
            name: row.Name,
            email: row.Email,
            phone: row.Phone,
            query: row.Query,
            tags: typeof row.Tags === "string"
              ? row.Tags.split(",").map(tag => tag.trim()).filter(Boolean)
              : [],
          }

          try {
            await axios.post("https://zeroinfy.thinksurfmedia.in/items/leads", leadData)
          } catch (error) {
            console.error("Error adding lead:", error)
          }
        }

        setUploadStatus("Upload and import completed.")
        setIsUploading(false)
        setStep("complete")
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
