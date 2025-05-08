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
import { Plus } from "lucide-react"

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [isNewUser, setIsNewUser] = useState(false) // Flag to differentiate between creating or editing a user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://zeroinfy.thinksurfmedia.in/users", {
          method: "GET",
          headers: {
            "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
        });
        
        const data = await response.json();

        console.log(data)
        setUsers(data.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch users.",
          variant: "destructive",
        })
      }
    }

    fetchUsers()
  }, [])  // Only fetch data once on component mount

  const handleEditUser = (user: any) => {
    setCurrentUser(user)
    setUserName(user.name)
    setUserEmail(user.email)
    setUserPhone(user.phone)
    setIsNewUser(false)  // Setting flag to false for editing
    setOpenModal(true)   // Open modal for editing
  }

  const handleSaveUser = async () => {
    try {
      if (isNewUser) {
        // Create new user
        await directus.request(readItems("users"), { method: 'POST', body: { name: userName, email: userEmail, phone: userPhone } })
        toast({ title: "Success", description: "User added successfully", variant: "success" })
      } else {
        // Update existing user
        await directus.request(readItems("users"), { method: 'PATCH', body: { id: currentUser.id, name: userName, email: userEmail, phone: userPhone } })
        toast({ title: "Success", description: "User updated successfully", variant: "success" })
      }
      setOpenModal(false)  // Close modal
      setUserName("")  // Clear form
      setUserEmail("")  // Clear form
      setUserPhone("")  // Clear form
      setCurrentUser(null)  // Clear current user
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the user.",
        variant: "destructive",
      })
    }
  }

  const handleCreateNewUser = () => {
    setUserName("")
    setUserEmail("")
    setUserPhone("")
    setIsNewUser(true)  // Flag for creating new user
    setOpenModal(true)  // Open modal for creating a new user
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <CardTitle>User Management</CardTitle>
            <Button
              onClick={handleCreateNewUser}
              variant="outline"
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />New User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditUser(user)} size="sm">
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
            <DialogTitle>{isNewUser ? "Create New User" : "Edit User"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name"
            />
            <Label htmlFor="userEmail" className="mt-4">Email</Label>
            <Input
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user email"
            />
            <Label htmlFor="userPhone" className="mt-4">Phone</Label>
            <Input
              id="userPhone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter user phone"
            />
          </DialogDescription>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              {isNewUser ? "Create" : "Save"} User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
