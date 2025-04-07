
import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImagePlus, Pencil } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

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
    name: 'CodX AI',
    avatar: '🤖',
    color: 'bg-blue-100 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800',
  },
};

export const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, images = [] }) => {
  const senderData = senderInfo[sender];
  const { generateImage, editImage } = useChat();
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  // Function to handle generating an image directly from chat
  const handleGenerateImage = () => {
    if (content) {
      generateImage(content);
    }
  };

  // Function to handle edit image request if an image is present
  const handleEditImage = (img: string) => {
    // Convert data URL to File object
    if (img && img.startsWith('data:')) {
      fetch(img)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "image.png", { type: blob.type });
          // Show a prompt requesting edit instructions
          const editPrompt = prompt("How would you like to edit this image?");
          if (editPrompt) {
            editImage(editPrompt, file);
          }
        });
    }
  };

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
          
          {images && images.length > 0 && (
            <div className="mb-3 space-y-2">
              {images.map((img, index) => (
                <div key={index} className="relative rounded-md overflow-hidden border border-muted group">
                  <img 
                    src={img} 
                    alt={`${sender === 'ai' ? 'Generated' : 'Uploaded'} image ${index + 1}`}
                    className="max-w-full max-h-80 object-contain mx-auto"
                  />
                  
                  {/* Image editing options */}
                  <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit this image"
                      onClick={() => handleEditImage(img)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {content && <MarkdownRenderer content={content} />}
          
          {/* Action buttons */}
          {sender === 'user' && content && !content.toLowerCase().startsWith('generate image') && (
            <div className="mt-2 flex justify-start">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1" 
                onClick={handleGenerateImage}
              >
                <ImagePlus size={14} />
                Generate image from this text
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
