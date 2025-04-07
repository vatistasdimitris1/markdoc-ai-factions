
import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export type FactionType = 'user' | 'blue' | 'red' | 'green' | 'purple';

export interface MessageProps {
  content: string;
  sender: FactionType;
  timestamp: Date;
  images?: string[];
}

const factionInfo = {
  user: {
    name: 'You',
    avatar: '👤',
    color: 'bg-secondary',
  },
  blue: {
    name: 'Blue Faction',
    avatar: '🔵',
    color: 'bg-faction-blue/10 border-faction-blue',
  },
  red: {
    name: 'Red Faction',
    avatar: '🔴',
    color: 'bg-faction-red/10 border-faction-red',
  },
  green: {
    name: 'Green Faction',
    avatar: '🟢',
    color: 'bg-faction-green/10 border-faction-green',
  },
  purple: {
    name: 'Purple Faction',
    avatar: '🟣',
    color: 'bg-faction-purple/10 border-faction-purple',
  },
};

export const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, images = [] }) => {
  const faction = factionInfo[sender];
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  // Combine any images with the markdown content
  const fullContent = images.length > 0
    ? images.map(img => `![Image](${img})\n\n`).join('') + content
    : content;

  return (
    <Card className={`p-4 border ${faction.color} mb-4`}>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>{faction.avatar}</AvatarFallback>
          <AvatarImage src={`/faction-${sender}.png`} />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{faction.name}</h4>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
          
          <MarkdownRenderer content={fullContent} />
        </div>
      </div>
    </Card>
  );
};
