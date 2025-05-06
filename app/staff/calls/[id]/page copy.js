"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Check, ArrowLeft, Edit, Save, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import directus from '../../../../lib/directus'
import { readItems } from "@directus/sdk"

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
      try {
        const path = window.location.pathname;
        const segments = path.split('/'); 
        const id = segments[segments.length - 1];
        
        // Fetch customer
        const customerRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/leads/${id}`);
        const customerData = await customerRes.json();
        console.log(customerData)
        setCustomer(customerData.data);

        // Fetch interactions
        const interactionsRes = await fetch(
          `https://zeroinfy.thinksurfmedia.in/items/interactions?filter${[id]}`
        );
        const interactionsData = await interactionsRes.json();
        setInteractions(interactionsData.data);

        // Fetch tags
        const tagsRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/tags`);
        const tagsData = await tagsRes.json();
        setAvailableTags(tagsData.data);

        // Fetch follow-up levels
        const followUpLevelsRes = await fetch(`https://zeroinfy.thinksurfmedia.in/items/followup_levels`);
        const followUpLevelsData = await followUpLevelsRes.json();
        setFollowUpLevels(followUpLevelsData.data.map((level) => level.name));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleTagSelect = (tag) => {
    // Handle tag selection logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await directus.items('leads').createOne({
        customer_id: customer_id,
        status,
        follow_up_level: followUpLevel,
        next_follow_up_date: nextFollowUpDate,
        notes,
      });

      // Optionally, update the customer status or other related fields
      await directus.items('leads').updateOne(customer_id, {
        status,
        follow_up_level: followUpLevel,
      });

      // Refresh interactions
      const interactionsData = await directus.items('leads').readByQuery({
        filter: { customer_id: { _eq: customer_id } },
        sort: ['-createdAt'],
      });
      setInteractions(interactionsData.data);

      // Reset form
      setStatus('');
      setFollowUpLevel('');
      setNextFollowUpDate(null);
      setNotes('');
    } catch (error) {
      console.error('Error submitting interaction:', error);
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
                      {/* <Badge>{customer.followUpLevel}</Badge> */}
                      {/* <Badge variant="outline">{customer.source}</Badge> */}
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
                      value={editedQuery}
                      onChange={(e) => setEditedQuery(e.target.value)}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm">{customer.query}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {editedTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            {/* <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0"
                              onClick={() => setEditedTags(editedTags.filter((t) => t !== tag))}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </Button> */}
                          </Badge>
                        ))}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Add Tags
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Manage Tags</DialogTitle>
                            <DialogDescription>
                              Select tags from different categories to add to this customer.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                             {/* Term Dropdown */}
                             <div className="grid gap-2">
                              <Label htmlFor="term">Term</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="term" className="w-full">
                                  <SelectValue placeholder="Select term" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search term..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Term")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Course Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="course">Course</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="course" className="w-full">
                                  <SelectValue placeholder="Select course" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search course..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Course")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Subject Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="subject" className="w-full">
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search subject..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Subject")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Faculty Dropdown */}
                            <div className="grid gap-2">
                              <Label htmlFor="faculty">Faculty</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="faculty" className="w-full">
                                  <SelectValue placeholder="Select faculty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search faculty..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {/* Faculty Options */}
                                  {['Faculty 1', 'Faculty 2', 'Faculty 3'].map((faculty, index) => (
                                    <SelectItem key={index} value={faculty}>
                                      <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border rounded flex items-center justify-center">
                                          {editedTags.includes(faculty) && <Check className="h-3 w-3" />}
                                        </div>
                                        {faculty}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Interest Tags */}
                            <div className="grid gap-2">
                              <Label htmlFor="interest">Interest</Label>
                              <Select onValueChange={(value) => handleTagSelect(value)}>
                                <SelectTrigger id="interest" className="w-full">
                                  <SelectValue placeholder="Select interest" />
                                </SelectTrigger>
                                <SelectContent>
                                  <div className="flex items-center border-b px-3 pb-1">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <Input
                                      placeholder="Search interest..."
                                      className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0"
                                    />
                                  </div>
                                  {availableTags
                                    .filter((tag) => tag.category === "Interest")
                                    .map((tag) => (
                                      <SelectItem key={tag.value} value={tag.value}>
                                        <div className="flex items-center gap-2">
                                          <div className="h-4 w-4 border rounded flex items-center justify-center">
                                            {editedTags.includes(tag.value) && <Check className="h-3 w-3" />}
                                          </div>
                                          {tag.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditedTags([])}>
                              Clear All Tags
                            </Button>
                            <DialogClose asChild>
                              <Button type="button">Done</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag, index) => {
                        return (
                          <Badge key={index}>
                            {tag}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSaveEdit}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* <Card style={{ backgroundColor: '#fef9c3' }}>
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
                    <div key={interaction.id} className="relative pl-6 pb-6">
                      {index < interactions.length - 1 && (
                        <div className="absolute left-2 top-2 bottom-0 w-0.5 bg-muted" />
                      )}
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge>{interaction.status}</Badge>
                          <Badge>
                            {interaction.followUpLevel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(interaction.createdAt)} at {formatTime(interaction.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm mt-2">{interaction.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card> */}
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
                  <label className="text-sm font-medium">Follow-up Level</label>
                  <Select value={followUpLevel} onValueChange={setFollowUpLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select follow-up level" />
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
                  <label className="text-sm font-medium">Next Follow-up Date & Time</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={nextFollowUpDate ? nextFollowUpDate.toISOString().slice(0, 16) : ""}
                      onChange={(e) => setNextFollowUpDate(e.target.value ? new Date(e.target.value) : undefined)}
                      min={new Date().toISOString().slice(0, 16)} // Ensures the minimum is the current date and time
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter notes about this interaction"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Interaction"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
};

export default CallDetailsPage;