'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Source = ({ form, handleTagChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await directus.request(readItems('sources'));
      setOptions(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Label htmlFor="source">Source</Label>
      <Select
        value={form?.tags?.source || ''}
        // onValueChange={(value) => handleTagChange('source', value)}
      >
        <SelectTrigger id="source">
          <SelectValue placeholder="Select Source" />
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

export default Source;