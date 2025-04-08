
import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
    color: 'bg-secondary dark:bg-secondary/30',
  },
  ai: {
    name: 'CodX - AI by vatistasdimitris',
    avatar: '🤖',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30',
  },
};

export const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, images = [] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const senderData = senderInfo[sender];
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  return (
    <Card className={`p-4 border ${senderData.color} mb-4 shadow-sm transition-all`}>
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
              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="cursor-pointer transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img 
                      src={img} 
                      alt={`${sender === 'ai' ? 'Generated' : 'Uploaded'} image ${idx + 1}`}
                      className="max-h-40 object-contain rounded-md border border-muted"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {content && <MarkdownRenderer content={content} />}
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex justify-center">
            <img 
              src={selectedImage ?? ''} 
              alt="Preview" 
              className="max-h-[70vh] max-w-full object-contain" 
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
