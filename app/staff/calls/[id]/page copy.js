"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";


const CallDetailsPage = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [followUpLevels, setFollowUpLevels] = useState([]);
  const [followUpLevel, setFollowUpLevel] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [availableTags, setAvailableTags] = useState([]); // Store available tags
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags to update

  useEffect(() => {
    const fetchData = async () => {
      const id = window.location.pathname.split("/").pop();

      const resLead = await fetch(`https://zeroinfy.thinksurfmedia.in/items/leads/${id}`);
      const leadData = await resLead.json();
      setCustomer(leadData.data);

      console.log("Customer")
      console.log(leadData.data)

      const resLevels = await fetch(`https://zeroinfy.thinksurfmedia.in/items/followup_levels`);
      const levelsData = await resLevels.json();
      setFollowUpLevels(levelsData.data.map((lvl) => lvl.name));

      const interactionIds = leadData.data.interactions || [];
      const allInteractions = await Promise.all(
        interactionIds.map((item) =>
          fetch(`https://zeroinfy.thinksurfmedia.in/items/interactions/${item.interaction_id}`).then((res) =>
            res.json()
          )
        )
      );
      setInteractions(allInteractions.map((item) => item.data));

      setAvailableTags(leadData.data.tags || []);

      // Set the initial selected tags to the ones the lead already has
      setSelectedTags(leadData.data.tags || []);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userEmail = localStorage.getItem("userName");

    try {
      const leadId = customer.id;

      // 1. Create new interaction
      const interactionRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          next_followup: nextFollowUpDate,
          notes,
          followup_by: userEmail,
        }),
      });

      const newInteraction = await interactionRes.json();
      const newInteractionId = newInteraction.data.id;

      // 2. Format interaction list
      const existingInteractions = customer.interactions || [];
      const updatedInteractionList = [...existingInteractions, { interaction_id: newInteractionId }];

      // 3. Update lead
      await fetch(`https://zeroinfy.thinksurfmedia.in/items/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
        body: JSON.stringify({
          followup_level: followUpLevel,
          status: callStatus,
          interactions: updatedInteractionList,
          next_followup_date: nextFollowUpDate
        }),
      });

      // 4. Fetch full interaction detail and add to state
      const newDetail = await fetch(
        `https://zeroinfy.thinksurfmedia.in/items/interactions/${newInteractionId}`
      ).then((res) => res.json());

      setInteractions((prev) => [...prev, newDetail.data]);

      // Reset form
      setFollowUpLevel("");
      setNextFollowUpDate("");
      setNotes("");
    } catch (err) {
      console.error("Error submitting interaction:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const leadId = customer.id;
  
    try {
      const res = await fetch(`https://zeroinfy.thinksurfmedia.in/items/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer HVmL8gc6vbrZV_uCI1sNYptBkxdEABfu`,
        },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update:", errorData);
      } else {
        console.log("Update successful");
      }

      setIsEditing(false)
    } catch (err) {
      console.error("Error in handleSave:", err);
    }
  };



  // Toggle selected tags when user checks/unchecks a tag
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/staff/calls")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Call Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card style={{ backgroundColor: "#dbeafe" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Customer Information</CardTitle>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{customer.name}</h3>
                  <Badge className="mt-1">{customer.status}</Badge>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h4>
                  {isEditing ? (
                    <>
                      <Input
                        label="Name"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      />
                      <Input
                        label="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      />
                      <Input
                        label="Phone"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <p className="text-sm">
                        <strong>Email:</strong> {customer.email}
                      </p>
                      <p className="text-sm">
                        <strong>Phone:</strong> {customer.phone}
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Query</h4>
                  {isEditing ? (
                    <Textarea
                      value={customer.query}
                      onChange={(e) => setCustomer({ ...customer, query: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm">{customer.query}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "filled" : "outline"}
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-black text-white" : ""}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "#fef9c3" }}>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No interactions yet</div>
              ) : (
                interactions.map((item) => (
                  <div key={item.id} className="mb-4">
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <Badge variant="outline" className="bg-black text-white capitalize">
                        {item.followup_by}
                      </Badge>
                      <span>{new Date(item.date_created).toLocaleString()}</span>
                    </div>
                    <div className="text-sm mt-1">{item.notes}</div>
                    <div className="text-xs mt-1">
                      Next follow-up: {new Date(item.next_followup).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6" style={{ backgroundColor: "#dcfce7" }}>
            <CardHeader>
              <CardTitle>Add Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Call Status</label>
                  <Select
                    value={callStatus || customer.status || "New"}
                    onValueChange={setCallStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Call Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["New", "In Progress", "Close", "Sold"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Follow-Up Level</label>
                  <Select
                    value={followUpLevel || customer.followup_level || ""}
                    onValueChange={setFollowUpLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Follow-Up Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {followUpLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Next Follow-Up Date</label>
                  <Input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes here..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Add Interaction"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CallDetailsPage;
