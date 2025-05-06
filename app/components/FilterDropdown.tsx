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
  tagFilters: string[]
  toggleTagFilter: (tag: string) => void
  valueKey?: string // default = "slug"
  labelKey?: string // default = "name"
}

export const FilterDropdown = ({
  label,
  collection,
  tagFilters,
  toggleTagFilter,
  valueKey = "slug",
  labelKey = "name",
}: FilterDropdownProps) => {
  const [items, setItems] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const data = await directus.request(readItems(collection))
        if (isMounted) {
          setItems(data)
        }
      } catch (error) {
        console.error(`Failed to fetch ${collection}:`, error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = items.filter((item) =>
    item[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {label} {tagFilters.length > 0 && `(${tagFilters.length})`}
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
          const value = item[labelKey]
          const display = item[labelKey]
          const isActive = tagFilters.includes(value)

          return (
            <DropdownMenuItem
              key={value}
              onClick={() => toggleTagFilter(value)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border rounded flex items-center justify-center">
                  {isActive && <Check className="h-3 w-3" />}
                </div>
                {display} {/* Display the value directly */}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
