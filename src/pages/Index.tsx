
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChatMessage } from '@/components/ChatMessage';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Loader2, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ChatInterface = () => {
  const { messages, sendMessage, generateImage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imagePrompt, setImagePrompt] = useState('');

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
    <div className="flex flex-col h-full max-h-screen">
      <header className="border-b p-4 bg-card">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">Gemini AI Chat</h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ImagePlus size={16} />
                Generate Image
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Generate an Image</SheetTitle>
                <SheetDescription>
                  Enter a detailed description of the image you want to create.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleImageGeneration} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Input
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading || !imagePrompt.trim()}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
                  Generate
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4">
        <div className="container max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center my-12 text-muted-foreground">
              <p className="text-lg mb-2">Welcome to Gemini AI Chat</p>
              <p>Send a message to start a conversation with Gemini AI.</p>
              <p className="mt-4 text-sm">
                You can use Markdown formatting in your messages:<br />
                <code>**bold**</code>, <code>*italic*</code>, <code>`code`</code>, <code>```code blocks```</code>
              </p>
              <p className="mt-2 text-sm">
                You can also upload images for analysis or generate images using the "Generate Image" button.
              </p>
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
      
      <footer className="border-t p-4 bg-background">
        <div className="container max-w-4xl mx-auto">
          <MarkdownEditor onSubmit={sendMessage} />
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-muted/30">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
};

export default Index;
