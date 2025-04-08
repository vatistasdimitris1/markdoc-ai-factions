
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Image, Edit } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogTrigger } from '@/components/ui/dialog';

// Example edit prompts
const editExamples = [
  "Convert this to a watercolor painting",
  "Add a cyberpunk style to this image",
  "Turn this into a cartoon character",
  "Change the background to a beach scene",
  "Make this look like an oil painting"
];

export const ImageEditModal = () => {
  const { editImage, isLoading } = useChat();
  const [editPrompt, setEditPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
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
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit size={16} />
            Edit Image
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit an Image</SheetTitle>
            <SheetDescription>
              Upload an image and provide instructions on how you want it edited.
            </SheetDescription>
          </SheetHeader>
          
          <Tabs defaultValue="upload" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="info">Supported Formats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div 
                    className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    <input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-40 mx-auto object-contain cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewDialogOpen(true);
                          }}
                        />
                        <p className="text-sm text-muted-foreground">Click image to enlarge or here to change</p>
                      </div>
                    ) : (
                      <div className="py-8 flex flex-col items-center gap-2">
                        <Image size={48} className="text-muted-foreground" />
                        <p className="mt-2">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  
                  <Input
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe how to edit the image..."
                    className="w-full mt-4"
                    disabled={!selectedImage}
                  />
                </div>
                
                {selectedImage && (
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Example edits:</p>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {editExamples.map((prompt, index) => (
                          <CarouselItem key={index} className="md:basis-1/2">
                            <div 
                              className="bg-white dark:bg-gray-800 p-3 rounded-md border cursor-pointer hover:border-primary transition-colors"
                              onClick={() => setEditPrompt(prompt)}
                            >
                              <p className="text-sm">{prompt}</p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center mt-2">
                        <CarouselPrevious className="relative static" />
                        <CarouselNext className="relative static" />
                      </div>
                    </Carousel>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !selectedImage || !editPrompt.trim()}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit className="mr-2 h-4 w-4" />}
                  Edit Image
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Supported Image Formats</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>JPEG/JPG (.jpg, .jpeg)</li>
                  <li>PNG (.png)</li>
                  <li>GIF (.gif) - static only</li>
                  <li>WebP (.webp)</li>
                </ul>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Size Limitations</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Maximum file size: 10MB</li>
                  <li>Recommended resolution: 1024x1024 pixels or lower</li>
                  <li>Higher resolution images may be automatically resized</li>
                </ul>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Best Practices</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use clear images with good lighting</li>
                  <li>Provide specific editing instructions</li>
                  <li>For style transfers, mention the specific style</li>
                  <li>For object removal, clearly describe what to remove</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
      
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {imagePreview && (
            <div className="mt-2 flex justify-center">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-[70vh] max-w-full object-contain" 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
