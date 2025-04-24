"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import directus from '../../lib/directus'
import { readItems } from '@directus/sdk'

type FollowupLevel = {
  id: string
  name: string
  color?: string
}

const FollowupLevelTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (id: string) => void
}) => {
  const [tabs, setTabs] = useState<FollowupLevel[]>([])

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const data = await directus.request(readItems('followup_levels'))
        setTabs(data)
      } catch (error) {
        console.error("Error fetching follow-up levels:", error)
      }
    }

    fetchTabs()
  }, [])

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      <Button
        variant={activeTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveTab("all")}
        className="min-w-[140px] flex-shrink-0"
        style={{ backgroundColor: 'black', color: 'white' }}
      >
        All Calls
      </Button>

      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.name ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab(tab.name)}
          className="min-w-[140px] flex-shrink-0"
          style={{ backgroundColor: tab.color || undefined }}
        >
          {tab.name}
        </Button>
      ))}
    </div>
  )
}

export default FollowupLevelTabs
