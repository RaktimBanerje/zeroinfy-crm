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

export default function FollowupLevelManagement() {
  const { toast } = useToast()
  const [followupLevels, setFollowupLevels] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentLevel, setCurrentLevel] = useState<any>(null)
  const [levelName, setLevelName] = useState("")
  const [isNewLevel, setIsNewLevel] = useState(false) // Flag to differentiate between creating or editing a followup level

  useEffect(() => {
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

    fetchFollowupLevels()
  }, [])  // Only fetch data once on component mount

  const handleEditLevel = (level: any) => {
    setCurrentLevel(level)
    setLevelName(level.name)
    setIsNewLevel(false)  // Setting flag to false for editing
    setOpenModal(true)   // Open modal for editing
  }

  const handleSaveLevel = async () => {
    try {
      if (isNewLevel) {
        // Create new followup level
        await directus.request(readItems("followup_levels"), { method: 'POST', body: { name: levelName } })
        toast({ title: "Success", description: "Followup level added successfully", variant: "success" })
      } else {
        // Update existing followup level
        await directus.request(readItems("followup_levels"), { method: 'PATCH', body: { id: currentLevel.id, name: levelName } })
        toast({ title: "Success", description: "Followup level updated successfully", variant: "success" })
      }
      setOpenModal(false)  // Close modal
      setLevelName("")  // Clear form
      setCurrentLevel(null)  // Clear current level
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the followup level.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewLevel = () => {
    setLevelName("")
    setIsNewLevel(true)  // Flag for creating new followup level
    setOpenModal(true)  // Open modal for creating a new followup level
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <h1 className="text-3xl font-bold">Followup Level Management</h1>

      <Button onClick={handleCreateNewLevel} variant="outline" size="sm" className="mb-4">
        Add New Followup Level
      </Button>

      {/* Followup Levels Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {followupLevels.map((level) => (
            <TableRow key={level.id}>
              <TableCell>{level.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEditLevel(level)} size="sm">
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
            <DialogTitle>{isNewLevel ? "Create New Followup Level" : "Edit Followup Level"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label htmlFor="levelName">Followup Level Name</Label>
            <Input
              id="levelName"
              value={levelName}
              onChange={(e) => setLevelName(e.target.value)}
              placeholder="Enter followup level name"
            />
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
