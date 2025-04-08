
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
    <div className="relative glass-morphism rounded-full bg-black/20 p-0 border border-purple-500/30">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Message CodX..."
        className="min-h-[40px] py-3 pl-4 pr-12 text-sm resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-full text-white placeholder:text-gray-400"
        onKeyDown={handleKeyDown}
      />
      
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
        <ImageUpload onUpload={handleImageUpload}>
          <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-purple-800/30">
            <ImageIcon size={16} />
          </Button>
        </ImageUpload>
        
        <Button 
          onClick={handleSubmit} 
          className="rounded-full h-8 w-8 p-0 ml-1 bg-purple-600 hover:bg-purple-700"
          disabled={!content.trim() && images.length === 0}
        >
          <Send size={14} />
        </Button>
      </div>
      
      {images.length > 0 && (
        <div className="absolute -top-20 left-0 right-0 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={URL.createObjectURL(image)} 
                alt={`Uploaded ${index}`} 
                className="h-16 w-16 object-cover rounded-lg border border-purple-500/30" 
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
    </div>
  );
};
