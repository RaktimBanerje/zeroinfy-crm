"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from "@/components/ui/input"
import directus from '../../../lib/directus'
import { readItems, updateItem } from "@directus/sdk"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const YourComponent = () => {
  const [tags, setTags] = useState([]); // Sources
  const [calls, setCalls] = useState([]); // Calls data
  const [selectedCalls, setSelectedCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [selectedTabColor, setSelectedTabColor] = useState("#d94cacb8");
  const [teams, setTeams] = useState([]);
  const [leads, setLeads] = useState([]);
  const [followupSourceCounts, setFollowupSourceCounts] = useState({});
  const [isDataParsed, setDataParsed] = useState(false);

  const handleLeadDistribution = async () => {
    try {
      // Iterate through each team to distribute leads
      for (const team of teams) {
        if (team.role === 'Team' && team.status === 'active') {
          // Find the input values in the table corresponding to this team and follow-up levels
          tabs.forEach((tab) => {
            // Check the leads for the current follow-up level (tab) and source (tag)
            const assignedLeads = filteredCalls.filter(call => call.followup_level === tab.name);
            
            assignedLeads.forEach(async (lead) => {
              // For each lead, update the tele_caller with the team's email
              const updatedLead = {
                ...lead,
                tele_caller: team.email, // Assign team's email to the lead's tele_caller field
              };

              try {
                // Update the lead with the new tele_caller
                await directus.request(updateItem("leads", lead.id, updatedLead));
              } catch (error) {
                console.error(`Error updating lead ${lead.id}:`, error);
              }
            });
          });
        }
      }

      // Optionally, you could show a confirmation message here
      alert('Leads distributed successfully!');
    } catch (error) {
      console.error("Error in lead distribution:", error);
    }
  };

  const fetchLeads = async () => {
    try {
      const data = await directus.request(readItems("leads"));
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  // Process leads data
  const processLeads = () => {
    const followupSourceCountsMap = {};

    // Initialize the map with all followup levels and sources
    tabs.forEach((level) => {
      followupSourceCountsMap[level.name] = {};

      tags.forEach((source) => {
        followupSourceCountsMap[level.name][source.name] = 0; // Initialize all counts as 0
      });
    });

    // Iterate over leads to count occurrences of each source for each followup level
    leads.forEach((lead) => {
      const followupLevel = lead.followup_level; // Ensure fallback to 'No Followup'
      const source = lead.source; // Ensure fallback to 'Unknown Source'

      // Initialize the followup level if not already present
      if (!followupSourceCountsMap[followupLevel]) {
        followupSourceCountsMap[followupLevel] = {};
      }

      // Initialize the source if not already present for the given followup level
      if (!followupSourceCountsMap[followupLevel][source]) {
        followupSourceCountsMap[followupLevel][source] = 0; // Start count at 0
      }

      // Increment the count for this source under the specific followup level
      followupSourceCountsMap[followupLevel][source] += 1;
    });

    console.log(followupSourceCountsMap)
    // Set the processed data into state
    setFollowupSourceCounts(followupSourceCountsMap);
    setDataParsed(true)
  };

  useEffect(() => {
    // Fetch tags (sources)
    const fetchTags = async () => {
      try {
        const data = await directus.request(readItems("sources"));
        setTags(data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    fetchTags(); // Call fetchTags to load sources when the component mounts
  }, []);

  useEffect(() => {
    const fetchFollowUpLevels = async () => {
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

    fetchFollowUpLevels();
  }, []);

  useEffect(() => {
    const fetchFollowUpLevels = async () => {
      try {
        const response = await fetch("https://zeroinfy.thinksurfmedia.in/items/teams", {
          method: "GET",
          headers: {
            "Authorization": `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
          },
        })

        const data = await response.json()
        setTeams(data.data)
      } catch (error) {
        console.error("Error fetching follow-up levels:", error);
      }
    };

    fetchFollowUpLevels();
  }, []);
  
  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (leads.length > 0 && tabs.length > 0 && tags.length > 0) {
      processLeads();
    }
  }, [leads, tabs, tags]);

  const handleTabSelect = (tabId, color) => {
    setSelectedTab(tabId);
    setSelectedTabColor(color)
    // Filter calls based on the selected follow-up level (tab)
    if (tabId) {
      const filtered = calls.filter((call) => call.followup_level === tabId);
      setFilteredCalls(filtered);
    } else {
      setFilteredCalls(calls);
    }
  };

  return (
    <div className="rounded-md border flex-1 space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Distribution</CardTitle>
        </CardHeader>

        <CardContent>
            <div className="tabs" style={{padding: 20}}>
              {isDataParsed && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'nowrap',  // Prevent wrapping of cards
                  gap: '16px', 
                  overflowX: 'auto', // Enable horizontal scrolling
                  padding: '16px',    // Optional: Padding for the container
                }}>
                  {Object.entries(followupSourceCounts).map(([followupLevel, sources]) => {
                    // Dynamically set the background color for the card based on followup level
                    const followupLevelData = tabs.find(tab => tab.name === followupLevel); // assuming `tabs` contains the followup level and color
                    const cardBgColor = followupLevelData ? followupLevelData.color : '#ffffff';  // Fallback to white if no color found
                    
                    return (
                      <Card 
                        key={followupLevel} 
                        style={{ 
                          flex: '0 0 auto',   // Prevent cards from shrinking or growing, fixed size
                          width: '300px',     // Adjust the card width as needed
                          padding: '16px', 
                          boxSizing: 'border-box', 
                          backgroundColor: cardBgColor, // Set the background color for the card
                          cursor: 'pointer'
                        }}
                        onClick={() => handleTabSelect(followupLevelData.id, followupLevelData.color)}
                      >
                        <CardHeader>
                          <CardTitle style={{ textAlign: 'center'}}>{followupLevel}</CardTitle>
                          <hr />
                        </CardHeader>

                        <CardContent>
                          {Object.entries(sources).map(([source, count]) => {
                            // Find the corresponding color for the source
                            const sourceData = tags.find(tag => tag.name === source); // assuming `tags` contains the source name and color
                            const sourceColor = sourceData ? sourceData.color : '#000000'; // Fallback to black if no color found

                            return (
                              <div key={source} style={{ marginBottom: '8px', textAlign: 'center' }}>
                                <Badge style={{ backgroundColor: sourceColor, color: 'black', padding: '5px 10px', fontSize: 13}}>
                                  {source} - {count}
                                </Badge>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tab content */}
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`tab-content ${selectedTab === tab.id ? 'active' : 'hidden'}`}
                style={{ display: selectedTab === tab.id ? 'block' : 'none', backgroundColor: "white", padding: '20px', marginTop: 20 }}
              >
                {/* Dynamic Table Layout */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]" style={{backgroundColor: selectedTabColor, color: 'black'}}>Team</TableHead>
                      {tags.map((tag) => (
                        <TableHead key={tag.id} style={{backgroundColor: selectedTabColor, color: 'black'}}>{tag.name} - {followupSourceCounts[tab.name]?.[tag.name] || 0}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {teams.map((team) => (
                      // Check if the team role is "Team" and the team status is "Active"
                      (team.role === "Team" && team.status === "active") && (
                        <TableRow
                          key={team.id}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {/* TableCell for team name with conditional background color */}
                          <TableCell style={{backgroundColor: selectedTabColor, color: 'black'}}>
                            {team.name}
                          </TableCell>

                          {/* TableCell for each tag */}
                          {tags.map((tag) => (
                            <TableCell key={tag.id} style={{backgroundColor: tag.color}}>
                              <Input />
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    ))}
                  </TableBody>
                </Table>

                <Button
                  onClick={handleLeadDistribution}
                  variant="outline"
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800 mt-4"
                >
                  <Save className="h-6 w-6" /> Distribute Now
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default YourComponent;
