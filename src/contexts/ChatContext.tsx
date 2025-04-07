
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageProps } from '@/components/ChatMessage';
import { useToast } from '@/components/ui/use-toast';
import { geminiService } from '@/services/geminiService';

interface ChatContextType {
  messages: MessageProps[];
  sendMessage: (content: string, images?: File[]) => Promise<void>;
  generateImage: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string, images: File[] = []) => {
    // Add user message
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response
    setIsLoading(true);
    try {
      const response = await geminiService.generateText(content, images);
      
      // Add AI response
      const aiMessage: MessageProps = {
        content: response.text,
        sender: 'ai',
        timestamp: new Date(),
        images: response.images,
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Failed to generate response",
        description: "There was an error communicating with the AI service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await geminiService.generateImage(prompt);
      
      // Add AI response with the generated image
      const aiMessage: MessageProps = {
        content: `Generated image for: "${prompt}"`,
        sender: 'ai',
        timestamp: new Date(),
        images: [response.imageUrl],
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Failed to generate image",
        description: "There was an error generating the image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage,
      generateImage,
      isLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
