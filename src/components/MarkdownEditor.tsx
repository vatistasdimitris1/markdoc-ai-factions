
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Send, ImageIcon } from 'lucide-react';

interface MarkdownEditorProps {
  onSubmit: (content: string, images: File[]) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();

  const handleImageUpload = (files: File[]) => {
    setImages((prevImages) => [...prevImages, ...files]);
    toast({
      title: "Images uploaded",
      description: `${files.length} image(s) added to your message`,
    });
  };
  
  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) {
      toast({
        title: "Cannot submit empty message",
        description: "Please add some text or images",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(content, images);
    setContent('');
    setImages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="p-4 border rounded-lg shadow-sm">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message here..."
        className="min-h-[100px] mb-2 text-sm"
        onKeyDown={handleKeyDown}
      />
      
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <ImageUpload onUpload={handleImageUpload}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ImageIcon size={16} />
            Add Image
          </Button>
        </ImageUpload>
        
        <Button onClick={handleSubmit} className="flex items-center gap-1">
          <Send size={16} />
          Send Message
        </Button>
      </div>
      
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Uploaded ${index}`} 
                className="h-20 w-20 object-cover rounded border" 
              />
              <button 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
