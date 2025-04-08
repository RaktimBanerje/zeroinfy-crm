"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash, TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTagsByType, addTag, updateTag, deleteTag } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function TagsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("course")
  const [tags, setTags] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTags, setFilteredTags] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  const [parentTags, setParentTags] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    type: "course",
    parentId: "",
  })

  useEffect(() => {
    // Load tags based on active tab
    loadTags()
  }, [activeTab])

  useEffect(() => {
    // Filter tags when search query changes
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const filtered = tags.filter((tag) => tag.name.toLowerCase().includes(query))
      setFilteredTags(filtered)
    } else {
      setFilteredTags(tags)
    }
  }, [searchQuery, tags])

  const loadTags = () => {
    const tagsByType = getTagsByType(activeTab)
    setTags(tagsByType)
    setFilteredTags(tagsByType)

    // Load parent tags if needed
    if (activeTab === "subject") {
      setParentTags(getTagsByType("course"))
    } else {
      setParentTags([])
    }
  }

  const handleAddTag = () => {
    try {
      // Validate form
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter a tag name",
          variant: "destructive",
        })
        return
      }

      // Add tag
      const newTag = addTag({
        name: formData.name,
        type: activeTab,
        parentId: activeTab === "subject" ? formData.parentId : undefined,
      })

      // Update state
      setTags([...tags, newTag])
      setIsAddDialogOpen(false)

      // Reset form
      setFormData({
        name: "",
        type: activeTab,
        parentId: "",
      })

      toast({
        title: "Success",
        description: "Tag added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditTag = () => {
    try {
      // Validate form
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please enter a tag name",
          variant: "destructive",
        })
        return
      }

      // Update tag
      const updatedTag = updateTag(selectedTag.id, {
        name: formData.name,
        parentId: activeTab === "subject" ? formData.parentId : undefined,
      })

      // Update state
      setTags(tags.map((tag) => (tag.id === selectedTag.id ? updatedTag : tag)))
      setIsEditDialogOpen(false)

      toast({
        title: "Success",
        description: "Tag updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = () => {
    try {
      // Delete tag
      deleteTag(selectedTag.id)

      // Update state
      setTags(tags.filter((tag) => tag.id !== selectedTag.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Success",
        description: "Tag deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (tag) => {
    setSelectedTag(tag)
    setFormData({
      name: tag.name,
      type: tag.type,
      parentId: tag.parentId || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (tag) => {
    setSelectedTag(tag)
    setIsDeleteDialogOpen(true)
  }

  const getTagTypeLabel = (type) => {
    switch (type) {
      case "course":
        return "Course"
      case "subject":
        return "Subject"
      case "term":
        return "Term"
      case "faculty":
        return "Faculty"
      case "custom":
        return "Custom"
      default:
        return type
    }
  }

  const getTagTypeColor = (type) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "subject":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "term":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "faculty":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "custom":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="course" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="course">Courses</TabsTrigger>
              <TabsTrigger value="subject">Subjects</TabsTrigger>
              <TabsTrigger value="term">Terms</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
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
                    {activeTab === "subject" && <TableHead>Parent Course</TableHead>}
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={activeTab === "subject" ? 4 : 3} className="text-center">
                        No tags found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        {activeTab === "subject" && (
                          <TableCell>
                            {tag.parentId ? parentTags.find((p) => p.id === tag.parentId)?.name || "Unknown" : "None"}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge className={getTagTypeColor(tag.type)}>{getTagTypeLabel(tag.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(tag)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(tag)}>
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
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Tag Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {getTagTypeLabel(activeTab)}</DialogTitle>
            <DialogDescription>Add a new {getTagTypeLabel(activeTab).toLowerCase()} tag.</DialogDescription>
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
            {activeTab === "subject" && (
              <div className="grid gap-2">
                <Label htmlFor="parentId">Parent Course</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="Select parent course" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentTags.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Add {getTagTypeLabel(activeTab)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedTag && getTagTypeLabel(selectedTag.type)}</DialogTitle>
            <DialogDescription>Update tag information.</DialogDescription>
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
            {activeTab === "subject" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-parentId">Parent Course</Label>
                <Select
                  value={formData.parentId}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                >
                  <SelectTrigger id="edit-parentId">
                    <SelectValue placeholder="Select parent course" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentTags.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
              {activeTab === "course" && (
                <p className="mt-2 text-red-500">
                  Warning: Deleting a course will also delete all subjects associated with it.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 py-4">
            {selectedTag && (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <TagIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{selectedTag.name}</div>
                  <div className="text-sm text-muted-foreground">{getTagTypeLabel(selectedTag.type)}</div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTag}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

