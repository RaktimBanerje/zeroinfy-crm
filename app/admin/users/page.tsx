"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function UserManagement() {
  const { toast } = useToast()
  const [teams, setTeams] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<any>(null)
  const [teamName, setTeamName] = useState("")
  const [teamEmail, setTeamEmail] = useState("")
  const [teamPhone, setTeamPhone] = useState("")
  const [teamPassword, setTeamPassword] = useState("")
  const [teamRole, setTeamRole] = useState("staff") // Default to staff role
  const [isActive, setIsActive] = useState(true) // Default to active
  const [isNewTeam, setIsNewTeam] = useState(false)
  const [roles, setRoles] = useState(['Admin', 'Team'])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("https://zeroinfy.thinksurfmedia.in/items/teams", {
          method: "GET",
          headers: {
            "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
        })

        const data = await response.json()
        setTeams(data.data) // Assuming `data` is the list of teams
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch teams.",
          variant: "destructive",
        })
      }
    }

    fetchTeams()
  }, []) // Empty dependency array to run only once when component mounts

  const handleEditTeam = (team: any) => {
    setCurrentTeam(team)
    setTeamName(team.name)
    setTeamEmail(team.email)
    setTeamPhone(team.phone)
    setTeamPassword("") // Password should be left empty when editing
    setTeamRole(team.role || "staff") // Set the role
    setIsActive(team.status === "active") // Set the active status
    setIsNewTeam(false)
    setOpenModal(true)
  }

  const handleSaveTeam = async () => {
    try {
      const teamPayload = {
        name: teamName,
        email: teamEmail,
        phone: teamPhone,
        password: teamPassword, // Password
        role: teamRole, // Role
        status: isActive ? "active" : "inactive", // Active status
      }

      const apiUrl = `https://zeroinfy.thinksurfmedia.in/items/teams`

      let response;

      if (isNewTeam) {
        // Create new team using POST request
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
          body: JSON.stringify(teamPayload),
        })

        if (!response.ok) {
          throw new Error("Failed to create the team")
        }

        toast({
          title: "Success",
          description: "Team added successfully",
          variant: "success",
        })
      } else {
        // Update existing team using PATCH request
        response = await fetch(`https://zeroinfy.thinksurfmedia.in/items/teams/${currentTeam.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`, // Add token if required
          },
          body: JSON.stringify(teamPayload),
        })

        if (!response.ok) {
          throw new Error("Failed to update the team")
        }

        const fetchTeams = async () => {
          try {
            const response = await fetch("https://zeroinfy.thinksurfmedia.in/items/teams", {
              method: "GET",
              headers: {
                "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
              },
            })

            const data = await response.json()
            setTeams(data.data) // Assuming `data` is the list of teams
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to fetch teams.",
              variant: "destructive",
            })
          }
        }

        fetchTeams()

        toast({
          title: "Success",
          description: "Team updated successfully",
          variant: "success",
        })
      }

      setOpenModal(false)
      setTeamName("")
      setTeamEmail("")
      setTeamPhone("")
      setTeamPassword("")
      setCurrentTeam(null)

    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the team.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewTeam = () => {
    setTeamName("")
    setTeamEmail("")
    setTeamPhone("")
    setTeamPassword("")
    setTeamRole("staff")
    setIsActive(true)
    setIsNewTeam(true)
    setOpenModal(true)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Teams Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>Team Management</CardTitle>
            <Button
              onClick={handleCreateNewTeam}
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" /> New Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.email}</TableCell>
                  <TableCell>{team.phone}</TableCell>
                  <TableCell>
                    <Badge color="primary">{team.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={team.status === 'active' ? 'success' : 'error'}>{team.status}</Badge>
                  </TableCell>
                  <TableCell>{team.password}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditTeam(team)} size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog (Modal replacement) */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewTeam ? "Create New Team" : "Edit Team"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
            <Label htmlFor="teamEmail" className="mt-4">Email</Label>
            <Input
              id="teamEmail"
              value={teamEmail}
              onChange={(e) => setTeamEmail(e.target.value)}
              placeholder="Enter team email"
            />
            <Label htmlFor="teamPhone" className="mt-4">Phone</Label>
            <Input
              id="teamPhone"
              value={teamPhone}
              onChange={(e) => setTeamPhone(e.target.value)}
              placeholder="Enter team phone"
            />
            <Label htmlFor="teamPassword" className="mt-4">Password</Label>
            <Input
              id="teamPassword"
              type="password"
              value={teamPassword}
              onChange={(e) => setTeamPassword(e.target.value)}
              placeholder="Enter team password"
            />

            {/* Role Selection with Dynamic Options */}
            <Label htmlFor="teamRole" className="mt-4">Role</Label>
            <Select
              id="teamRole"
              value={teamRole}
              onValueChange={(value) => setTeamRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Team Checkbox */}
            <Label htmlFor="isActive" className="mt-4">Activate Team</Label>
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
            >
              Active
            </Checkbox>
          </DialogDescription>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTeam}>
              {isNewTeam ? "Create" : "Save"} Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
