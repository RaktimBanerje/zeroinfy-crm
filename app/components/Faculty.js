'use client';

import React, { useEffect, useState } from 'react';
import directus from '../../lib/directus';
import { readItems } from '@directus/sdk';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Faculties = ({ form, handleTagChange }) => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await directus.request(readItems('faculties')); // Adjust collection name if needed
        setFaculties(data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    fetchFaculties();
  }, []);

  return (
    <>
      <Label htmlFor="faculties">Faculty</Label>
      <Select
        value={form?.tags?.faculties || ''}
        // onValueChange={(value) => handleTagChange('faculties', value)}
      >
        <SelectTrigger id="faculties">
          <SelectValue placeholder="Select Faculty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {faculties.map((faculty) => (
            <SelectItem key={faculty.id} value={faculty.name}>
              {faculty.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default Faculties;