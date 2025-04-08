
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChatMessage } from '@/components/ChatMessage';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Loader2, ImageIcon, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ImageEditModal } from '@/components/ImageEditModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const examplePrompts = [
  "A futuristic city with flying cars and neon lights",
  "A peaceful mountain landscape at sunset",
  "A cute robot pet playing in a garden",
  "An underwater scene with bioluminescent creatures",
  "A fantasy castle in the clouds"
];

const ChatInterface = () => {
  const { messages, sendMessage, generateImage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePrompt.trim()) {
      generateImage(imagePrompt);
      setImagePrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <header className="border-b p-4 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            CodX - AI by vatistasdimitris
          </h1>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ImageIcon size={16} />
                  Generate Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Generate an Image</DialogTitle>
                  <DialogDescription>
                    Enter a detailed description of the image you want to create.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleImageGeneration} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">Try to be as specific as possible for best results.</p>
                  </div>
                  
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Example prompts:</p>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {examplePrompts.map((prompt, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div 
                              className="bg-white dark:bg-gray-800 p-3 rounded-md border cursor-pointer hover:border-primary transition-colors"
                              onClick={() => setImagePrompt(prompt)}
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
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading || !imagePrompt.trim()}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                    Generate
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            
            <ImageEditModal />
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4">
        <div className="container max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center my-12 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Welcome to CodX AI</h2>
              <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">Start a conversation or generate images with advanced AI</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-indigo-900 p-6 rounded-lg shadow-sm">
                  <ImageIcon className="mx-auto h-10 w-10 text-indigo-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Generate Images</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Create unique images from text descriptions</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-purple-900 p-6 rounded-lg shadow-sm">
                  <Edit className="mx-auto h-10 w-10 text-purple-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Edit Images</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Modify and transform your existing images</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-center my-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="border-t p-4 bg-white dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto">
          <MarkdownEditor onSubmit={sendMessage} />
        </div>
      </footer>

      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-2 flex justify-center">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-h-[70vh] max-w-full object-contain" 
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
};

export default Index;
