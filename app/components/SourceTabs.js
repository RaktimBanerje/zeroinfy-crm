import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import directus from "../../lib/directus"
import { readItems } from "@directus/sdk"

const SourceTabs = ({ activeSourceTab, setActiveSourceTab }) => {
  const [tags, setTags] = useState([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await directus.request(readItems("sources"))
        setTags(data)
      } catch (error) {
        console.error("Error fetching sources:", error)
      }
    }

    fetchTags()
  }, [])

  return (
    <div className="flex space-x-2 overflow-auto pb-2">
      <Button
        variant={activeSourceTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveSourceTab("all")}
        className="min-w-[120px]"
        style={{ backgroundColor: 'black', color: 'white' }}
      >
        All Sources
      </Button>

      {tags.map((tag) => (
        <Button
          key={tag.id}
          variant={activeSourceTab === tag.name ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSourceTab(tag.name)}
          className="min-w-[120px]"
          style={{ backgroundColor: tag.color || undefined }}
        >
          {tag.name}
        </Button>
      ))}
    </div>
  )
}

export default SourceTabs