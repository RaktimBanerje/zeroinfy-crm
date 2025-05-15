"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import directus from "../../lib/directus";
import { readItems } from "@directus/sdk";
import { ChevronRight, ChevronDown } from "lucide-react";

const FollowupLevelTabs = ({ activeTab, setActiveTab }) => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const data = await directus.request(readItems("followup_levels"));

        const formattedTabs = data.map((item) => ({
          id: item.id,
          name: item.name,
          color: item.color,
        }));

        setTabs(formattedTabs);
      } catch (error) {
        console.error("Error fetching follow-up levels:", error);
      }
    };

    fetchTabs();
  }, []);

  const renderArrow = (isActive) =>
    isActive ? (
      <ChevronDown className="ml-2 w-4 h-4 text-black" />
    ) : (
      <ChevronRight className="ml-2 w-4 h-4 text-black" />
    );

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {/* All Calls Tab */}
      <Button
        variant={activeTab === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveTab("all")}
        className="min-w-[140px] flex-shrink-0"
        style={{ backgroundColor: "#e24aa3cc", color: "white", width: 200 }}
      >
        <span className="flex items-center text-white">
          All Calls
        </span>
        {renderArrow(activeTab === "all")}
      </Button>

      {/* Dynamic Followup Level Tabs */}
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.name)}
            className="min-w-[140px] flex-shrink-0"
            style={{ backgroundColor: tab.color || undefined, width: "220px" }}
          >
            <span className="flex items-center text-black">
              {tab.name}
              {/* You can optionally add a count here if available */}
              {/* Example count: */}
              {/* {tab.count && ( */}
              {/*   <span className="ml-2 bg-white text-black text-xs font-semibold px-2 py-0.5 rounded-full"> */}
              {/*     {tab.count} */}
              {/*   </span> */}
              {/* )} */}
            </span>
            {renderArrow(isActive)}
          </Button>
        );
      })}
    </div>
  );
};

export default FollowupLevelTabs;
