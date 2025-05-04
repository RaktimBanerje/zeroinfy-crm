"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { DialogDescription } from "@radix-ui/react-dialog"

export default function SourceManagement() {
  const { toast } = useToast()
  const [sources, setSources] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentTag, setCurrentTag] = useState<any>(null)
  const [tagName, setTagName] = useState("")
  const [isNewTag, setIsNewTag] = useState(false) // Flag to differentiate between creating or editing a tag

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const data = await directus.request(readItems("sources"))
        setSources(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch sources.",
          variant: "destructive",
        })
      }
    }

    fetchSources()
  }, [])  // Only fetch data once on component mount

  const handleEditTag = (tag: any) => {
    setCurrentTag(tag)
    setTagName(tag.name)
    setIsNewTag(false)  // Setting flag to false for editing
    setOpenModal(true)   // Open modal for editing
  }

  const handleSaveTag = async () => {
    try {
      if (isNewTag) {
        // Create new tag
        await directus.request(readItems("sources"), { method: 'POST', body: { name: tagName } })
        toast({ title: "Success", description: "Tag added successfully", variant: "success" })
      } else {
        // Update existing tag
        await directus.request(readItems("sources"), { method: 'PATCH', body: { id: currentTag.id, name: tagName } })
        toast({ title: "Success", description: "Tag updated successfully", variant: "success" })
      }
      setOpenModal(false)  // Close modal
      setTagName("")  // Clear form
      setCurrentTag(null)  // Clear current tag
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the tag.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewTag = () => {
    setTagName("")
    setIsNewTag(true)  // Flag for creating new tag
    setOpenModal(true)  // Open modal for creating a new tag
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <h1 className="text-3xl font-bold">Source Management</h1>

      <Button onClick={handleCreateNewTag} variant="outline" size="sm" className="mb-4">
        Add New Source
      </Button>

      {/* Source Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditTag(tag)} size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog (Modal replacement) */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewTag ? "Create New Source" : "Edit Source"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label htmlFor="tagName">Source Name</Label>
            <Input
              id="tagName"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Enter source name"
            />
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag}>
              {isNewTag ? "Create" : "Save"} Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
