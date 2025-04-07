
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { ImageUpload } from './ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

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

  const handleAddCode = () => {
    const codeBlock = "```\n// Your code here\n```";
    setContent((prev) => prev + "\n" + codeBlock + "\n");
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

  return (
    <Card className="p-4 border rounded-lg shadow-sm">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write in Markdown - **bold**, *italic*, `code`, > quotes, etc."
        className="min-h-[150px] mb-2 font-mono text-sm"
      />
      
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddCode}
            className="flex items-center gap-1"
          >
            Add Code Block
          </Button>
          <ImageUpload onUpload={handleImageUpload} />
        </div>
        
        <Button onClick={handleSubmit}>
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
