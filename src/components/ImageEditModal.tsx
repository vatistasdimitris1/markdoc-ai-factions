
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Image, ImageEdit } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';

export const ImageEditModal = () => {
  const { editImage, isLoading } = useChat();
  const [editPrompt, setEditPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: 'No image selected',
        description: 'Please select an image to edit',
        variant: 'destructive',
      });
      return;
    }
    
    if (!editPrompt.trim()) {
      toast({
        title: 'Edit instruction required',
        description: 'Please provide instructions on how to edit the image',
        variant: 'destructive',
      });
      return;
    }
    
    editImage(editPrompt, selectedImage);
    setEditPrompt('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ImageEdit size={16} />
          Edit Image
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit an Image</SheetTitle>
          <SheetDescription>
            Upload an image and provide instructions on how you want it edited.
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <label htmlFor="imageUpload" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto object-contain" />
                    <p className="text-sm text-muted-foreground">Click to change image</p>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center gap-2">
                    <Image size={32} className="text-muted-foreground" />
                    <p>Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB</p>
                  </div>
                )}
              </label>
            </div>
            
            <Input
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="Describe how to edit the image (e.g., 'Make it look like a cartoon')"
              className="w-full"
              disabled={!selectedImage}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !selectedImage || !editPrompt.trim()}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageEdit className="mr-2 h-4 w-4" />}
            Edit Image
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
