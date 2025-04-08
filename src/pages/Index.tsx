
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChatMessage } from '@/components/ChatMessage';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Loader2, ImageIcon, Settings, Sun, Moon, Info, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageEditModal } from '@/components/ImageEditModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [creativityLevel, setCreativityLevel] = useState<string>('balanced');

  // Handle theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-white dark:bg-gray-950">
      <header className="border-b py-3 px-4 bg-white dark:bg-gray-950 shadow-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CodX
          </h1>
          
          <div className="flex gap-2 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0">
                  <ImageIcon size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate an Image</DialogTitle>
                  <DialogDescription>
                    Enter a detailed description of the image you want to create.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleImageGeneration} className="mt-4 space-y-4">
                  <Input
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full"
                  />
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                    <p className="text-sm font-medium mb-2">Creativity Level</p>
                    <div className="flex gap-2">
                      {['low', 'balanced', 'high'].map((level) => (
                        <Button 
                          key={level} 
                          type="button"
                          variant={creativityLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCreativityLevel(level)}
                          className="capitalize"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme} 
              className="rounded-full w-9 h-9 p-0"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0">
                  <Settings size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onSelect={() => toggleTheme()}>
                  {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <Sheet>
                  <SheetTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Info className="mr-2 h-4 w-4" />
                      About CodX
                    </DropdownMenuItem>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>About CodX</SheetTitle>
                      <SheetDescription>
                        CodX is an AI assistant powered by vatistasdimitris
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">AI Limitations</p>
                          <p className="mt-1 text-muted-foreground">CodX can make mistakes. Consider checking important information.</p>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-4">
                        <div>
                          <h3 className="font-medium mb-1">Privacy Policy</h3>
                          <p className="text-muted-foreground">
                            We respect your privacy and are committed to protecting your personal data.
                            Your conversations with CodX may be stored to improve our services.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Terms of Service</h3>
                          <p className="text-muted-foreground">
                            By using CodX, you agree to our terms of service. CodX should not be used
                            for harmful, illegal, or unethical purposes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        <div className="container max-w-3xl mx-auto pt-4 pb-20">
          {messages.length === 0 ? (
            <div className="text-center my-12 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to CodX AI</h2>
              <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">Start a conversation or generate images with advanced AI</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 p-6 rounded-lg shadow-sm">
                  <ImageIcon className="mx-auto h-10 w-10 text-blue-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Generate Images</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Create unique images from text descriptions</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-purple-900 p-6 rounded-lg shadow-sm">
                  <Info className="mx-auto h-10 w-10 text-purple-500 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Ask Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get instant answers to your questions</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Generating response...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="border-t fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 py-3 px-4">
        <div className="container max-w-3xl mx-auto">
          <MarkdownEditor onSubmit={sendMessage} />
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
};

export default Index;
