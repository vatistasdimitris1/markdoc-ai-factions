
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChatMessage } from '@/components/ChatMessage';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Loader2, ImageIcon, Settings, Sun, Moon, Info, AlertTriangle, BookText, Brain, PenSquare, LineChart, ListTodo, Image as ImageAnalyzeIcon, AlignLeft, MicIcon, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageEditModal } from '@/components/ImageEditModal';
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

const actionsConfig = [
  { icon: <PenSquare className="h-5 w-5 text-purple-300" />, label: "Create Image", color: "purple" },
  { icon: <AlignLeft className="h-5 w-5 text-green-300" />, label: "Summarize Text", color: "green" },
  { icon: <MessageSquarePlus className="h-5 w-5 text-blue-300" />, label: "Help me write", color: "blue" },
  { icon: <LineChart className="h-5 w-5 text-orange-300" />, label: "Analyze data", color: "orange" },
  { icon: <ListTodo className="h-5 w-5 text-pink-300" />, label: "Make a plan", color: "pink" },
  { icon: <ImageAnalyzeIcon className="h-5 w-5 text-yellow-300" />, label: "Analyze images", color: "yellow" },
];

const ChatInterface = () => {
  const { messages, sendMessage, generateImage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
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
    <div className="flex flex-col h-full max-h-screen bg-background purple-gradient-bg">
      <header className="border-b border-purple-900/50 py-3 px-4 bg-black/10 sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CodX
          </h1>
          
          <div className="flex gap-2 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 text-gray-300 hover:bg-purple-800/30">
                  <ImageIcon size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-morphism border-purple-500/30 bg-black/40">
                <DialogHeader>
                  <DialogTitle className="text-white">Generate an Image</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Enter a detailed description of the image you want to create.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleImageGeneration} className="mt-4 space-y-4">
                  <div className="glass-morphism p-1 rounded-full border border-purple-500/30">
                    <input
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="w-full py-2 px-4 bg-transparent border-none focus:outline-none text-white rounded-full placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div className="glass-morphism p-4 rounded-xl border border-purple-500/30">
                    <p className="text-sm font-medium mb-2 text-white">Creativity Level</p>
                    <div className="flex gap-2">
                      {['low', 'balanced', 'high'].map((level) => (
                        <Button 
                          key={level} 
                          type="button"
                          variant={creativityLevel === level ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCreativityLevel(level)}
                          className={`capitalize ${creativityLevel === level ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-300 border-purple-500/30 hover:bg-purple-800/30'}`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
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
              className="rounded-full w-9 h-9 p-0 text-gray-300 hover:bg-purple-800/30"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full w-9 h-9 p-0 text-gray-300 hover:bg-purple-800/30">
                  <Settings size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-morphism border-purple-500/30 bg-black/50 text-white">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-purple-500/30" />
                
                <DropdownMenuItem onSelect={() => toggleTheme()} className="hover:bg-purple-800/30">
                  {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-purple-500/30" />
                
                <Sheet>
                  <SheetTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="hover:bg-purple-800/30">
                      <Info className="mr-2 h-4 w-4" />
                      About CodX
                    </DropdownMenuItem>
                  </SheetTrigger>
                  <SheetContent className="glass-morphism border-purple-500/30 bg-black/50 text-white">
                    <SheetHeader>
                      <SheetTitle className="text-white">About CodX</SheetTitle>
                      <SheetDescription className="text-gray-300">
                        CodX is an AI assistant powered by vatistasdimitris
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-start gap-2 text-amber-400 glass-morphism p-3 rounded-xl border-amber-500/30">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">AI Limitations</p>
                          <p className="mt-1 text-gray-300">CodX can make mistakes. Consider checking important information.</p>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-4">
                        <div>
                          <h3 className="font-medium mb-1">Privacy Policy</h3>
                          <p className="text-gray-300">
                            We respect your privacy and are committed to protecting your personal data.
                            Your conversations with CodX may be stored to improve our services.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-1">Terms of Service</h3>
                          <p className="text-gray-300">
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
            <div className="text-center my-12 p-6">
              <h2 className="text-2xl font-bold mb-4 text-gradient">Hi, I'm CodX</h2>
              <p className="text-lg mb-6 text-gray-300">How can I help you today?</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 max-w-2xl mx-auto">
                {actionsConfig.map((action, index) => (
                  <button key={index} className="action-card">
                    <div className="action-icon">
                      {action.icon}
                    </div>
                    <span className="text-white text-sm">{action.label}</span>
                  </button>
                ))}
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
                <Loader2 className="h-8 w-8 animate-spin text-purple-400 mb-2" />
                <p className="text-sm text-gray-300">Generating response...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="fixed bottom-4 left-0 right-0 px-4">
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
      <div className="min-h-screen purple-gradient-bg">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
};

export default Index;
