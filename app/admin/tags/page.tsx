 "use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import directus from "@/lib/directus"
import { readItems } from "@directus/sdk"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Plus, Trash2 } from "lucide-react"

export default function TagManagement() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("courses")
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [terms, setTerms] = useState([])
  const [faculties, setFaculties] = useState([])
  const [customTagsOne, setCustomTagsOne] = useState([])
  const [customTagsTwo, setCustomTagsTwo] = useState([])

  const [openModal, setOpenModal] = useState(false)
  const [currentTag, setCurrentTag] = useState<any>(null)
  const [tagName, setTagName] = useState("")
  const [tagCategory, setTagCategory] = useState("custom_tags_one")
  const [isNewTag, setIsNewTag] = useState(false)

  const fetchData = async (collection: string) => {
    try {
      const data = await directus.request(readItems(collection))
      switch (collection) {
        case "courses":
          setCourses(data)
          break
        case "subjects":
          setSubjects(data)
          break
        case "terms":
          setTerms(data)
          break
        case "faculties":
          setFaculties(data)
          break
        case "custom_tags_one":
          setCustomTagsOne(data)
          break
        case "custom_tags_two":
          setCustomTagsTwo(data)
          break
        default:
          break
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data for this tab.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const handleEditTag = (tag: any, category: string) => {
    setCurrentTag(tag)
    setTagName(tag.name)
    setTagCategory(category)
    setIsNewTag(false)
    setOpenModal(true)
  }

  const handleCreateNewTag = () => {
    setTagName("")
    setTagCategory(activeTab)
    setIsNewTag(true)
    setOpenModal(true)
  }

  const handleDeleteTag = async (tag: any, category: string) => {
    console.log(tag);
  
    try {
      const response = await fetch(`https://zeroinfy.thinksurfmedia.in/items/${category}/${tag.id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete tag: ${response.statusText}`);
      }
  
      toast({ title: "Deleted", description: "Tag deleted successfully", variant: "success" });
      fetchData(category);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete tag", variant: "destructive" });
    }
  }

  const handleSaveTag = async () => {
    try {
      const payload = { name: tagName }
      
      const apiUrl = `https://zeroinfy.thinksurfmedia.in/items/${tagCategory}`
  
      if (isNewTag) {
        // Create new tag using POST request
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`, 
          },
          body: JSON.stringify(payload),
        })
  
        if (!response.ok) {
          throw new Error("Failed to create the tag")
        }
  
        toast({
          title: "Success",
          description: "Tag created successfully",
          variant: "success",
        })
      } else {
        // Update existing tag using PATCH request
        const response = await fetch(`https://zeroinfy.thinksurfmedia.in/items/${tagCategory}/${currentTag.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`, // Add token if required
          },
          body: JSON.stringify(payload),
        })
  
        if (!response.ok) {
          throw new Error("Failed to update the tag")
        }
  
        toast({
          title: "Success",
          description: "Tag updated successfully",
          variant: "success",
        })
      }
  
      setOpenModal(false)
      setTagName("")
      setCurrentTag(null)
      fetchData(tagCategory) // Re-fetch data after saving the tag
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save tag",
        variant: "destructive",
      })
    }
  }

  const renderTable = (data: any[], category: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell>{tag.name}</TableCell>
            <TableCell className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEditTag(tag, category)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTag(tag, category)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>Tag Management</CardTitle>
            <Button
              onClick={handleCreateNewTag}
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />New Tag
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="courses" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="faculties">Faculties</TabsTrigger>
              <TabsTrigger value="custom_tags_one">Custom Tags One</TabsTrigger>
              <TabsTrigger value="custom_tags_two">Custom Tags Two</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">{renderTable(courses, "courses")}</TabsContent>
            <TabsContent value="subjects">{renderTable(subjects, "subjects")}</TabsContent>
            <TabsContent value="terms">{renderTable(terms, "terms")}</TabsContent>
            <TabsContent value="faculties">{renderTable(faculties, "faculties")}</TabsContent>
            <TabsContent value="custom_tags_one">{renderTable(customTagsOne, "custom_tags_one")}</TabsContent>
            <TabsContent value="custom_tags_two">{renderTable(customTagsTwo, "custom_tags_two")}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewTag ? "Create New Tag" : "Edit Tag"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <div>
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div>
              <Label htmlFor="tagCategory">Tag Category</Label>
              <select
                id="tagCategory"
                value={tagCategory}
                onChange={(e) => setTagCategory(e.target.value)}
                className="w-full border border-input rounded px-2 py-1"
              >
                <option value="courses">Courses</option>
                <option value="subjects">Subjects</option>
                <option value="terms">Terms</option>
                <option value="faculties">Faculties</option>
                <option value="custom_tags_one">Custom Tags One</option>
                <option value="custom_tags_two">Custom Tags Two</option>
              </select>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag}>
              {isNewTag ? "Create" : "Save"} Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
