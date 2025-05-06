"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Check, ArrowLeft, Edit, Save, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CallDetailsPage = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [followUpLevels, setFollowUpLevels] = useState([]);
  const [status, setStatus] = useState('');
  const [followUpLevel, setFollowUpLevel] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const path = window.location.pathname;
      const segments = path.split('/');
      const id = segments[segments.length - 1];

      // Fetch customer
      const customerRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/leads/${id}`);
      const customerData = await customerRes.json();
      setCustomer(customerData.data);

      // Fetch interactions from localStorage (if any)
      const storedInteractions = JSON.parse(localStorage.getItem(`interactions_${id}`)) || [];
      setInteractions(storedInteractions);

      // Fetch tags
      const tagsRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/tags`);
      const tagsData = await tagsRes.json();
      setAvailableTags(tagsData.data);

      // Fetch follow-up levels
      const followUpLevelsRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/followup_levels`);
      const followUpLevelsData = await followUpLevelsRes.json();
      setFollowUpLevels(followUpLevelsData.data.map((level) => level.name));
    };

    fetchData();
  }, []);

  const handleTagSelect = (tag) => {
    // Handle tag selection logic
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const interactionData = {
      status,
      followUpLevel,
      nextFollowUpDate,
      notes,
      createdAt: new Date(),
    };

    try {
      // Get current customer ID
      const path = window.location.pathname;
      const segments = path.split('/');
      const customerId = segments[segments.length - 1];

      // Fetch current interactions from localStorage
      const storedInteractions = JSON.parse(localStorage.getItem(`interactions_${customerId}`)) || [];

      // Add new interaction
      const updatedInteractions = [...storedInteractions, interactionData];

      // Store the updated interactions back to localStorage
      localStorage.setItem(`interactions_${customerId}`, JSON.stringify(updatedInteractions));

      // Update local state with new interaction
      setInteractions(updatedInteractions);

      // Reset form fields
      setStatus('');
      setFollowUpLevel('');
      setNextFollowUpDate(null);
      setNotes('');
    } catch (error) {
      console.error('Error saving interaction:', error);
    } finally {
      setIsSubmitting(false);
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
          <Card style={{ backgroundColor: '#dbeafe' }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Customer Information</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{customer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge>{customer.status}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {customer.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {customer.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Query</h4>
                  {isEditing ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm">{customer.query}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fef9c3' }}>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {interactions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No interactions yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {interactions.map((interaction, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge>{interaction.status}</Badge>
                        <Badge>{interaction.followUpLevel}</Badge>
                        <span className="text-xs text-muted-foreground">{interaction.createdAt.toString()}</span>
                      </div>
                      <p className="text-sm mt-2">{interaction.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6" style={{ backgroundColor: '#dcfce7' }}>
            <CardHeader>
              <CardTitle>Add Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Close">Closed</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Follow-Up Level</label>
                  <Select value={followUpLevel} onValueChange={setFollowUpLevel}>
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
