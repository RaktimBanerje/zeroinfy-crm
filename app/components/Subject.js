'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Subject = ({ form, handleTagChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await directus.request(readItems('subjects'));
      setOptions(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Label htmlFor="subject">Subject</Label>
      <Select
        value={form?.tags?.subject || ''}
        // onValueChange={(value) => handleTagChange('subjects', value)}
      >
        <SelectTrigger id="subject">
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {options.map(tag => (
            <SelectItem key={tag.id} value={tag.name}>{tag.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default Subject;
