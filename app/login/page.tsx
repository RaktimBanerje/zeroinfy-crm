"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [teams, setTeams] = useState([])

  // Fetch teams and users data
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
        setTeams(data.data) // Assuming `data.data` is the list of teams
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch teams.",
          variant: "destructive",
        })
      }
    }

    fetchTeams()
  }, [])

const handleLogin = () => {
  setIsLoading(true)

  setTimeout(() => {
    let userFound = null

    // Check if the email, password, and status match for any team user
    const matchedTeam = teams.find(
      (team) => team.email === email && team.password === password && team.status === 'active'
    );

    console.log({ email, matchedTeam })

    if (matchedTeam) {
      userFound = matchedTeam
      // Save the user information in localStorage
      
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", email.split("@")[0])

      toast({
        title: "Login successful",
        description: `Logged in as Team member`,
      })

      if (matchedTeam.role === "Team") {
        localStorage.setItem("userType", "team")
        router.push(`/staff/dashboard`) // Redirect to team dashboard
      } else {
        localStorage.setItem("userType", "admin")
        router.push(`/admin/dashboard`) // Redirect to admin dashboard
      }
    } else {
      // If user is not found in team list, check if the user is an Admin
      if (email === "superadmin@example.com" && password === "123456789") {
        userFound = { email, password, role: "admin" }
        // Save the admin info in localStorage
        localStorage.setItem("userType", "admin")
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", "admin")

        toast({
          title: "Login successful",
          description: `Logged in as Admin`,
        })

        router.push(`/admin/dashboard`) // Redirect to admin dashboard
      }
    }

    // If no user is found with the credentials, show error
    if (!userFound) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }, 1000) // Simulate API call delay
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <img
            src="https://zeroinfy.in/cdn/shop/files/ZEROINFY_NEW_WEBSITE_LOGO_200x.png?v=1683973607"
            alt="Zeroinfy Logo"
            className="mx-auto h-12 w-auto"
          />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
