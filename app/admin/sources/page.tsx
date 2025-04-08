"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getSources, addSource, updateSource, deleteSource } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function SourcesPage() {
  const { toast } = useToast()
  const [sources, setSources] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSources, setFilteredSources] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
  })

  useEffect(() => {
    // Load sources
    const allSources = getSources()
    setSources(allSources)
    setFilteredSources(allSources)
  }, [])

  useEffect(() => {
    // Filter sources when search query changes
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = sources.filter((source) => source.name.toLowerCase().includes(query))
      setFilteredSources(filtered)
    } else {
      setFilteredSources(sources)
    }
  }, [searchQuery, sources])

  const handleAddSource = () => {
    try {
      // Validate form
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter a source name",
          variant: "destructive",
        })
        return
      }

      // Add source
      const newSource = addSource(formData.name)

      // Update state
      setSources([...sources, newSource])
      setIsAddDialogOpen(false)

      // Reset form
      setFormData({
        name: "",
      })

      toast({
        title: "Success",
        description: "Source added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditSource = () => {
    try {
      // Validate form
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter a source name",
          variant: "destructive",
        })
        return
      }

      // Update source
      const updatedSource = updateSource(selectedSource.id, formData.name)

      // Update state
      setSources(sources.map((source) => (source.id === selectedSource.id ? updatedSource : source)))
      setIsEditDialogOpen(false)

      toast({
        title: "Success",
        description: "Source updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteSource = () => {
    try {
      // Delete source
      deleteSource(selectedSource.id)

      // Update state
      setSources(sources.filter((source) => source.id !== selectedSource.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Success",
        description: "Source deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (source) => {
    setSelectedSource(source)
    setFormData({
      name: source.name,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (source) => {
    setSelectedSource(source)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Source Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Source
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lead Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sources..."
              className="w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No sources found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(source)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(source)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Source</DialogTitle>
            <DialogDescription>Add a new lead source.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSource}>Add Source</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Source Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Source</DialogTitle>
            <DialogDescription>Update source information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSource}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Source Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this source? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            {selectedSource && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="font-medium">{selectedSource.name}</div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSource}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

