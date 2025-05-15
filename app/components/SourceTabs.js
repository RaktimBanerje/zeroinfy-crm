import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import directus from "../../lib/directus";
import { readItems } from "@directus/sdk";
import { ChevronRight, ChevronDown } from "lucide-react";

const SourceTabs = ({ activeSourceTab, setActiveSourceTab }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await directus.request(readItems("sources"));
        setTags(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    fetchTags();
  }, []);

  const renderArrow = (isActive) =>
    isActive ? (
      <ChevronDown className="ml-2 w-4 h-4 text-black" />
    ) : (
      <ChevronRight className="ml-2 w-4 h-4 text-black" />
    );

  return (
    <div className="flex space-x-2 overflow-auto pb-2">
      {/* All Sources Tab */}
      <Button
        size="sm"
        onClick={() => setActiveSourceTab("all")}
        className="relative flex justify-center items-center px-4"
        style={{
          backgroundColor: "#e24aa3cc",
          color: "black",
          border: "none",
          outline: "none",
          boxShadow: "none",
          width: "200px", // Directly setting width here
        }}
      >
        <span className="flex items-center text-white">
          All Sources
        </span>
        {renderArrow(activeSourceTab === "all")}
      </Button>

      {/* Dynamic Source Tabs */}
      {tags.map((tag) => {
        const isActive = activeSourceTab === tag.name;
        return (
          <Button
            key={tag.id}
            size="sm"
            onClick={() => setActiveSourceTab(tag.name)}
            className="relative min-w-[120px] flex justify-between items-center px-4"
            style={{
              backgroundColor: tag.color || undefined,
              color: "black",
            }}
          >
            <span className="flex items-center text-black">
              {tag.name}
              {tag.count !== undefined && (
                <span className="ml-2 bg-white text-black text-xs font-semibold px-2 py-0.5 rounded-full">
                  {tag.count}
                </span>
              )}
            </span>
            {renderArrow(isActive)}
          </Button>
        );
      })}
    </div>
  );
};

export default SourceTabs;
