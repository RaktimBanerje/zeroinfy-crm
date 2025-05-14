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

export const FilterDropdown = ({
  label,
  collection,
  tagFilters,
  toggleTagFilter,
  valueKey = "slug",
  labelKey = "name",
}) => {
  const [items, setItems] = useState([]) // Fetched items
  const [searchTerm, setSearchTerm] = useState("") // For search functionality
  const [localTagFilters, setLocalTagFilters] = useState(tagFilters) // Local state for the filters

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const data = await directus.request(readItems(collection))
        if (isMounted) {
          setItems(data)
          setLocalTagFilters((prevFilters) =>
            prevFilters.filter((tag) =>
              data.some((item) => item[labelKey] === tag)
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
    console.log({ collection, items, tagFilters, localTagFilters })
  }, [collection, items, tagFilters, localTagFilters])

  const filteredItems = items.filter((item) =>
    item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleTagFilter = (tag) => {
    setLocalTagFilters((prevFilters) => {
      if (prevFilters.includes(tag)) {
        return prevFilters.filter((filter) => filter !== tag)
      } else {
        return [...prevFilters, tag]
      }
    })
    toggleTagFilter(tag)
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
          const value = item[valueKey]
          const display = item[labelKey]
          const isActive = tagFilters.includes(value)

          console.log({ value, display, isActive })

          return (
            <DropdownMenuItem
              key={value}
              onClick={() => handleToggleTagFilter(value)}
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
