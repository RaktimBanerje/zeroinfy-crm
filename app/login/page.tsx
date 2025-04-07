"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (userType: "admin" | "staff") => {
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      // In a real app, you would validate credentials against a backend
      localStorage.setItem("userType", userType)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userName", email.split("@")[0])

      toast({
        title: "Login successful",
        description: `Logged in as ${userType}`,
      })
      
      router.push(`/${userType}/calls`)

      // if(userType == "staff") {
      //   router.push(`/${userType}/calls`)
      // }
      // else {
      //   router.push(`/${userType}/dashboard`)
      // }
      
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Zeroinfy CRM</CardTitle>
          <CardDescription>Enter your credentials to access the CRM system</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="demo">Demo Access</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="px-0 text-xs">
                      Forgot password?
                    </Button>
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("staff")}
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? "Logging in..." : "Login as Staff"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="demo">
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">Choose a demo account to explore the system</p>
                <div className="grid gap-2">
                  <Button
                    onClick={() => handleLogin("admin")}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    disabled={isLoading}
                  >
                    Login as Admin
                  </Button>
                  <Button
                    onClick={() => handleLogin("staff")}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    disabled={isLoading}
                  >
                    Login as Staff
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <p>Demo credentials are automatically filled in demo mode</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

