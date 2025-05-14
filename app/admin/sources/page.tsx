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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Pencil } from "lucide-react"

export default function SourceManagement() {
  const { toast } = useToast()
  const [sources, setSources] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentTag, setCurrentTag] = useState<any>(null)
  const [tagName, setTagName] = useState("")
  const [color, setColor] = useState("#000000")
  const [isNewTag, setIsNewTag] = useState(false)

  const fetchData = async () => {
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

  useEffect(() => {
    fetchData()
  }, [])

  const handleEditTag = (tag: any) => {
    setCurrentTag(tag)
    setTagName(tag.name)
    setColor(tag.color || "#000000")
    setIsNewTag(false)
    setOpenModal(true)
  }

  const handleSaveTag = async () => {
    try {
      if (isNewTag) {
        await fetch("https://zeroinfy.thinksurfmedia.in/items/sources", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
          body: JSON.stringify({ name: tagName, color }),
        })
        toast({ title: "Success", description: "Source added successfully", variant: "success" })
      } else {
        await fetch(`https://zeroinfy.thinksurfmedia.in/items/sources/${currentTag.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
          body: JSON.stringify({ name: tagName, color }),
        })
        toast({ title: "Success", description: "Source updated successfully", variant: "success" })
      }

      setOpenModal(false)
      setTagName("")
      setColor("#000000")
      setCurrentTag(null)
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the source.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewTag = () => {
    setTagName("")
    setColor("#000000")
    setIsNewTag(true)
    setOpenModal(true)
  }

  const handleDeleteTag = async (tag: any) => {
    try {
      const response = await fetch(`https://zeroinfy.thinksurfmedia.in/items/sources/${tag.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete tag: ${response.statusText}`)
      }

      toast({ title: "Deleted", description: "Tag deleted successfully", variant: "success" })
      fetchData()
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to delete tag", variant: "destructive" })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>Source Management</CardTitle>
            <Button
              onClick={handleCreateNewTag}
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Source
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>
                    <div
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: tag.color || "#000000" }}
                      title={tag.color}
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditTag(tag)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTag(tag)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewTag ? "Create New Source" : "Edit Source"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <div>
              <Label htmlFor="tagName">Source Name</Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter source name"
              />
            </div>
            <div>
              <Label htmlFor="tagColor">Color</Label>
              <Input
                type="color"
                id="tagColor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 p-0 h-10 border-none"
              />
            </div>
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
