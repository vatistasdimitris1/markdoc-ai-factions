
import React, { useRef, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onUpload: (files: File[]) => void;
  children?: ReactNode; // Add this to accept children
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, children }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types (only images)
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      });
    }
    
    if (imageFiles.length > 0) {
      onUpload(imageFiles);
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div onClick={() => fileInputRef.current?.click()}>
        {children}
      </div>
    </>
  );
};
