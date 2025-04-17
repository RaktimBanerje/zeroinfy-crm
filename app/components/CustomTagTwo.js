'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CustomTagTwo = ({ form, handleTagChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await directus.request(readItems('custom_tags_two'));
      setOptions(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Label htmlFor="customTagTwo">Custom Tag Two</Label>
      <Select
        value={form?.tags?.customTagTwo || ''}
        // onValueChange={(value) => handleTagChange('customTagTwo', value)}
      >
        <SelectTrigger id="customTagTwo">
          <SelectValue placeholder="Select Custom Tag Two" />
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

export default CustomTagTwo;