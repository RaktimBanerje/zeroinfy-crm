'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FollowUpLevel = ({ form, handleTagChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await directus.request(readItems('follow_up_level'));
      setOptions(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Label htmlFor="followUpLevel">Follow Up Level</Label>
      <Select
        value={form?.tags?.followUpLevel || ''}
        // onValueChange={(value) => handleTagChange('followup-levels', value)}
      >
        <SelectTrigger id="followUpLevel">
          <SelectValue placeholder="Select Follow Up Level" />
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

export default FollowUpLevel;