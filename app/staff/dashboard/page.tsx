"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Dummy data for assigned calls by source
const pendingCallsBySource = {
  Website: 12,
  "Phone Inquiry": 8,
  Referral: 15,
  "Social Media": 7,
  "Email Campaign": 4,
}

// Dummy data for pending calls by source
const freshCallsBySource = {
  Website: 8,
  "Phone Inquiry": 5,
  Referral: 6,
  "Social Media": 10,
  "Email Campaign": 3,
}

// Dummy data for completed calls by source
const followUpCallsBySource = {
  Website: 18,
  "Phone Inquiry": 12,
  Referral: 9,
  "Social Media": 14,
  "Email Campaign": 7,
}

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState("pending")

  // Get source color
  const getSourceColor = (source: string) => {
    switch (source) {
      case "Website":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-500"
      case "Phone Inquiry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-500"
      case "Referral":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-500"
      case "Social Media":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-500"
      case "Email Campaign":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-500"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-500"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <Button asChild>
          <Link href="/staff/calls">View All Calls</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-blue-50 dark:bg-blue-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <Badge className="bg-blue-500">+5% from last week</Badge>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              <Badge className="bg-amber-500">-2% from last week</Badge>
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">76</div>
            <p className="text-xs text-muted-foreground">
              <Badge className="bg-green-500">+12% from last week</Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Source Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Call Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Assigned</TabsTrigger>
              <TabsTrigger value="fresh">Pending</TabsTrigger>
              <TabsTrigger value="followup">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(pendingCallsBySource).map(([source, count]) => (
                  <Card key={source} className={`border-l-4 ${getSourceColor(source)}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex justify-between items-center">
                        {source}
                        <Badge>{count}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Pending calls from {source}</p>
                        <Button size="sm" asChild>
                          <Link href={`/staff/calls?source=${encodeURIComponent(source)}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fresh">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(freshCallsBySource).map(([source, count]) => (
                  <Card key={source} className={`border-l-4 ${getSourceColor(source)}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex justify-between items-center">
                        {source}
                        <Badge>{count}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Fresh calls from {source}</p>
                        <Button size="sm" asChild>
                          <Link href={`/staff/calls?tab=fresh-calls&source=${encodeURIComponent(source)}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="followup">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(followUpCallsBySource).map(([source, count]) => (
                  <Card key={source} className={`border-l-4 ${getSourceColor(source)}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium flex justify-between items-center">
                        {source}
                        <Badge>{count}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Follow-up calls from {source}</p>
                        <Button size="sm" asChild>
                          <Link href={`/staff/calls?tab=first-followup&source=${encodeURIComponent(source)}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">You added a new interaction for Rahul Sharma</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-sm font-medium">You were assigned 3 new calls</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-sm font-medium">You updated the status for Priya Patel to "In Progress"</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

