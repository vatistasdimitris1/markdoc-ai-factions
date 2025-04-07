
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FactionType } from './ChatMessage';

interface FactionSelectorProps {
  value: FactionType;
  onChange: (faction: FactionType) => void;
}

export const FactionSelector: React.FC<FactionSelectorProps> = ({ value, onChange }) => {
  return (
    <Select 
      value={value} 
      onValueChange={(value: FactionType) => onChange(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select AI Faction" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="blue">🔵 Blue Faction</SelectItem>
        <SelectItem value="red">🔴 Red Faction</SelectItem>
        <SelectItem value="green">🟢 Green Faction</SelectItem>
        <SelectItem value="purple">🟣 Purple Faction</SelectItem>
      </SelectContent>
    </Select>
  );
};
