
import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export type SenderType = 'user' | 'ai';

export interface MessageProps {
  content: string;
  sender: SenderType;
  timestamp: Date;
  images?: string[];
}

const senderInfo = {
  user: {
    name: 'You',
    avatar: '👤',
    color: 'bg-secondary',
  },
  ai: {
    name: 'Gemini AI',
    avatar: '🤖',
    color: 'bg-blue-100 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800',
  },
};

export const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, images = [] }) => {
  const senderData = senderInfo[sender];
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  // Combine any images with the markdown content
  const fullContent = images.length > 0
    ? images.map(img => `![Image](${img})\n\n`).join('') + content
    : content;

  return (
    <Card className={`p-4 border ${senderData.color} mb-4`}>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback>{senderData.avatar}</AvatarFallback>
          <AvatarImage src={`/avatar-${sender}.png`} />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{senderData.name}</h4>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
          
          <MarkdownRenderer content={fullContent} />
        </div>
      </div>
    </Card>
  );
};
