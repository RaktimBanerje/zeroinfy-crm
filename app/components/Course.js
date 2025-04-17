'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Course = ({ form, handleTagChange }) => {
  const [courseTags, setCourseTags] = useState([]);

  useEffect(() => {
    const fetchCourseTags = async () => {
      try {
        const data = await directus.request(readItems('courses')); // Adjust collection name if needed
        setCourseTags(data);
      } catch (error) {
        console.error('Error fetching course tags:', error);
      }
    };

    fetchCourseTags();
  }, []);

  return (
    <>
      <Label htmlFor="course">Course</Label>
      <Select
        value={form?.tags?.course || ''}
        // onValueChange={(value) => handleTagChange('course', value)}
      >
        <SelectTrigger id="course">
          <SelectValue placeholder="Select course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {courseTags.map((tag) => (
            <SelectItem key={tag.id} value={tag.name}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default Course;