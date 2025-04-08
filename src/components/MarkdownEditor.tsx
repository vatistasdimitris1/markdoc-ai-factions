
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
    <Card className="p-2 border rounded-2xl shadow-sm bg-white dark:bg-gray-900">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Message CodX..."
        className="min-h-[40px] mb-1 text-sm resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-2xl"
        onKeyDown={handleKeyDown}
      />
      
      <div className="flex items-center justify-between flex-wrap gap-1">
        <ImageUpload onUpload={handleImageUpload}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Add image</span>
          </Button>
        </ImageUpload>
        
        <Button 
          onClick={handleSubmit} 
          className="rounded-full flex items-center justify-center w-10 h-10 p-0"
          disabled={!content.trim() && images.length === 0}
        >
          <Send size={16} />
        </Button>
      </div>
      
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Uploaded ${index}`} 
                className="h-20 w-20 object-cover rounded-lg border" 
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
