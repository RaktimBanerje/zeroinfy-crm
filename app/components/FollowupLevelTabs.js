"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import directus from '../../lib/directus'
import { readItems } from '@directus/sdk'

const FollowupLevelTabs = ({ activeTab, setActiveTab }) => {
  const [tabs, setTabs] = useState([])

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const data = await directus.request(readItems('followup_levels'))

        const formattedTabs = data.map((item) => ({
          id: item.id,
          name: item.name,
          color: item.color,
        }))

        setTabs(formattedTabs)
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
        style={{ backgroundColor: 'black', color: 'white', width: 200 }}
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
          style={{ backgroundColor: tab.color || undefined, width: '220px' }}
        >
          {tab.name}
        </Button>
      ))}
    </div>
  )
}

export default FollowupLevelTabs
