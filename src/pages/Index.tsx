
import React, { useEffect, useRef } from 'react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChatMessage } from '@/components/ChatMessage';
import { FactionSelector } from '@/components/FactionSelector';
import { useChat, ChatProvider } from '@/contexts/ChatContext';
import { Loader2 } from 'lucide-react';

const ChatInterface = () => {
  const { messages, selectedFaction, setSelectedFaction, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-screen">
      <header className="border-b p-4 bg-card">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-bold">Markdoc AI Factions</h1>
          <FactionSelector value={selectedFaction} onChange={setSelectedFaction} />
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4">
        <div className="container max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center my-12 text-muted-foreground">
              <p className="text-lg mb-2">Welcome to Markdoc AI Factions</p>
              <p>Send a message to start a conversation with your chosen faction.</p>
              <p className="mt-4 text-sm">
                You can use Markdown formatting in your messages:<br />
                <code>**bold**</code>, <code>*italic*</code>, <code>`code`</code>, <code>```code blocks```</code>
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
