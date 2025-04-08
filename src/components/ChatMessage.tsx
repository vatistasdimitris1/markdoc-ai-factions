
import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
    color: 'bg-purple-950/30',
  },
  ai: {
    name: 'CodX',
    avatar: '🤖',
    color: 'bg-purple-800/10',
  },
};

export const ChatMessage: React.FC<MessageProps> = ({ content, sender, timestamp, images = [] }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const senderData = senderInfo[sender];
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  const handleDownloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `codx-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`py-4 ${sender === 'user' ? '' : 'bg-purple-950/10'}`}>
      <div className="container max-w-3xl mx-auto px-4">
        <div className="flex items-start gap-3">
          <Avatar className="mt-1 border border-purple-500/30">
            <AvatarFallback className="bg-purple-900 text-white">{senderData.avatar}</AvatarFallback>
            <AvatarImage src={`/avatar-${sender}.png`} />
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-white">{senderData.name}</h4>
              <span className="text-xs text-gray-400">{formattedTime}</span>
            </div>
            
            {images && images.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative group glass-morphism p-1 rounded-xl"
                    >
                      <img 
                        src={img} 
                        alt={`${sender === 'ai' ? 'Generated' : 'Uploaded'} image ${idx + 1}`}
                        className="max-h-40 object-contain rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => setSelectedImage(img)}
                      />
                      {sender === 'ai' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 border-purple-500/30 hover:bg-purple-900/50 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage(img);
                          }}
                        >
                          <Download size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {content && (
              <div className="text-gray-100">
                <MarkdownRenderer content={content} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl glass-morphism bg-black/40 border-purple-500/30 text-white">
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
          {selectedImage && sender === 'ai' && (
            <div className="flex justify-end mt-4">
              <Button 
                onClick={() => handleDownloadImage(selectedImage)}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Download size={16} />
                Download Image
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
