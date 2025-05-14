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
import { Pencil, Trash2, Plus } from "lucide-react"

export default function FollowupLevelManagement() {
  const { toast } = useToast()
  const [followupLevels, setFollowupLevels] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<any>(null)
  const [levelName, setLevelName] = useState("")
  const [color, setColor] = useState("#000000")
  const [isNewLevel, setIsNewLevel] = useState(false)

  const fetchFollowupLevels = async () => {
    try {
      const data = await directus.request(readItems("followup_levels"))
      setFollowupLevels(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch followup levels.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchFollowupLevels()
  }, [])

  const handleCreateNewLevel = () => {
    setLevelName("")
    setColor("#000000")
    setCurrentLevel(null)
    setIsNewLevel(true)
    setOpenModal(true)
  }

  const handleEditLevel = (level: any) => {
    setCurrentLevel(level)
    setLevelName(level.name)
    setColor(level.color || "#000000")
    setIsNewLevel(false)
    setOpenModal(true)
  }

  const handleSaveLevel = async () => {
    try {
      if (isNewLevel) {
        // Create new followup level
        await fetch("https://zeroinfy.thinksurfmedia.in/items/followup_levels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
          body: JSON.stringify({ name: levelName, color }),
        })
        toast({ title: "Success", description: "Followup level added successfully", variant: "success" })
      } else {
        // Update followup level
        await fetch(`https://zeroinfy.thinksurfmedia.in/items/followup_levels/${currentLevel.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
          body: JSON.stringify({ name: levelName, color }),
        })
        toast({ title: "Success", description: "Followup level updated successfully", variant: "success" })
      }

      setOpenModal(false)
      setLevelName("")
      setColor("#000000")
      setCurrentLevel(null)
      fetchFollowupLevels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the followup level.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLevel = async (level: any) => {
    try {
      const res = await fetch(`https://zeroinfy.thinksurfmedia.in/items/followup_levels/${level.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to delete level: ${res.statusText}`)
      }

      toast({ title: "Deleted", description: "Followup level deleted successfully", variant: "success" })
      fetchFollowupLevels()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete followup level", variant: "destructive" })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Followup Levels Management</CardTitle>
          <Button
            onClick={handleCreateNewLevel}
            variant="outline"
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Followup Level
          </Button>
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
              {followupLevels.map((level) => (
                <TableRow key={level.id}>
                  <TableCell>{level.name}</TableCell>
                  <TableCell>
                    <div
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: level.color || "#000000" }}
                      title={level.color}
                    />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditLevel(level)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLevel(level)}>
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
            <DialogTitle>{isNewLevel ? "Create Followup Level" : "Edit Followup Level"}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="space-y-4">
            <div>
              <Label htmlFor="levelName">Level Name</Label>
              <Input
                id="levelName"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Enter followup level name"
              />
            </div>
            <div>
              <Label htmlFor="levelColor">Color</Label>
              <Input
                type="color"
                id="levelColor"
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
            <Button onClick={handleSaveLevel}>
              {isNewLevel ? "Create" : "Save"} Followup Level
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
