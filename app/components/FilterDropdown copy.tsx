"use client"

import { useEffect, useState } from "react"
import { Check, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import directus from '../../lib/directus'
import { readItems } from "@directus/sdk"

type FilterDropdownProps = {
  label: string
  collection: string
  tagFilters: string[]  // The array to hold selected filters (no longer used as a prop)
  toggleTagFilter: (tag: string) => void
  valueKey?: string // default = "slug"
  labelKey?: string // default = "name"
}

export const FilterDropdown = ({
  label,
  collection,
  tagFilters,  // Removed from usage, but will filter in the state now
  toggleTagFilter,
  valueKey = "slug",
  labelKey = "name",
}: FilterDropdownProps) => {
  const [items, setItems] = useState<any[]>([])  // Fetched items
  const [searchTerm, setSearchTerm] = useState("")  // For search functionality
  const [localTagFilters, setLocalTagFilters] = useState(tagFilters)  // Local state for the filters

  // Effect to fetch data when component is mounted
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const data = await directus.request(readItems(collection))
        
        if (isMounted) {
          setItems(data)

          // Filter localTagFilters to keep only valid tags that exist in fetched data
          setLocalTagFilters((prevFilters) => 
            prevFilters.filter((tag) =>
              data.some((item) => item[labelKey] === tag)  // Check if tag exists in the fetched data
            )
          )
        }
      } catch (error) {
        console.error(`Failed to fetch ${collection}:`, error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [collection, labelKey])

  useEffect(() => {
    console.log({ collection, items, tagFilters, localTagFilters})
  }, [collection, items, tagFilters, localTagFilters])

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle the filter toggle
  const handleToggleTagFilter = (tag: string) => {
    setLocalTagFilters((prevFilters) => {
      if (prevFilters.includes(tag)) {
        return prevFilters.filter((filter) => filter !== tag)  // Remove tag if already selected
      } else {
        return [...prevFilters, tag]  // Add tag if not already selected
      }
    })
    toggleTagFilter(tag)  // Ensure that the parent function is called as well
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {label} {localTagFilters.length > 0 && `(${localTagFilters.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>Filter by {label}</DropdownMenuLabel>
        <Input
          placeholder="Search..."
          className="mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredItems.map((item) => {
          const value = item[labelKey]  // Use valueKey for the tag value
          const display = item[labelKey]  // Use labelKey for the display name
          const isActive = tagFilters.includes(value)  // Check if the tag is selected

          console.log({value, display, isActive})

          return (
            <DropdownMenuItem
              key={value}
              onClick={() => handleToggleTagFilter(value)}  // Toggle the selection
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border rounded flex items-center justify-center">
                  {isActive && <Check className="h-3 w-3" />}
                </div>
                {display}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
