
import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    name: 'CodX - AI by vatistasdimitris',
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

  return (
    <Card className={`p-4 border ${senderData.color} mb-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <Avatar className="mt-1">
          <AvatarFallback>{senderData.avatar}</AvatarFallback>
          <AvatarImage src={`/avatar-${sender}.png`} />
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">{senderData.name}</h4>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
          
          {images && images.length > 0 && (
            <div className="mb-3">
              {images.length === 1 ? (
                <div className="relative rounded-md overflow-hidden border border-muted mb-2">
                  <img 
                    src={images[0]} 
                    alt={`${sender === 'ai' ? 'Generated' : 'Uploaded'} image`}
                    className="max-w-full max-h-80 object-contain mx-auto"
                  />
                </div>
              ) : (
                <Collapsible>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded-md border border-muted"
                        />
                      ))}
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1">
                        <Eye size={16} />
                        <span>View all</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden border border-muted">
                          <img 
                            src={img} 
                            alt={`${sender === 'ai' ? 'Generated' : 'Uploaded'} image ${index + 1}`}
                            className="max-w-full max-h-80 object-contain mx-auto"
                          />
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}
          
          {content && <MarkdownRenderer content={content} />}
        </div>
      </div>
    </Card>
  );
};
