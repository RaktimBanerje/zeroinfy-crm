'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CustomTagOne = ({ form, handleTagChange }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await directus.request(readItems('custom_tags_one'));
        setTags(data);
      } catch (error) {
        console.error('Error fetching CustomTagOne:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <>
      <Label htmlFor="customTagOne">Custom Tag One</Label>
      <Select
        value={form?.tags?.customTagOne || ''}
        // onValueChange={(value) => handleTagChange('customTagOne', value)}
      >
        <SelectTrigger id="customTagOne">
          <SelectValue placeholder="Select Custom Tag One" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.id} value={tag.name}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default CustomTagOne;