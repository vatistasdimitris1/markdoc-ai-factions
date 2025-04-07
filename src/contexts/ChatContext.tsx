
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageProps } from '@/components/ChatMessage';
import { useToast } from '@/components/ui/use-toast';
import { geminiService } from '@/services/geminiService';

interface ChatContextType {
  messages: MessageProps[];
  sendMessage: (content: string, images?: File[]) => Promise<void>;
  generateImage: (prompt: string) => Promise<void>;
  editImage: (prompt: string, image: File) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Helper to get context from previous messages
  const getPreviousContext = (limit = 10) => {
    // Get the most recent messages (limited) to provide context
    const recentMessages = messages.slice(-limit);
    
    return recentMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  };

  const sendMessage = async (content: string, images: File[] = []) => {
    // Add user message
    const userMessage: MessageProps = {
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // If user uploaded images, add them to the message
    if (images.length > 0) {
      userMessage.images = images.map(img => URL.createObjectURL(img));
    }
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response with context
    setIsLoading(true);
    try {
      // Get previous context for the AI
      const conversationContext = getPreviousContext();
      
      // Send the message with context and any images
      const response = await geminiService.generateText(content, images, conversationContext);
      
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
    // Add user message with the prompt
    const userMessage: MessageProps = {
      content: `Generate image: "${prompt}"`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
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

  const editImage = async (prompt: string, image: File) => {
    // Create object URL for the image preview
    const imageUrl = URL.createObjectURL(image);
    
    // Add user message with the image to edit
    const userMessage: MessageProps = {
      content: `Edit request: ${prompt}`,
      sender: 'user',
      timestamp: new Date(),
      images: [imageUrl],
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate edited image
    setIsLoading(true);
    try {
      const response = await geminiService.editImage(prompt, image);
      
      // Add AI response with the edited image
      const aiMessage: MessageProps = {
        content: `Image edited based on: "${prompt}"`,
        sender: 'ai',
        timestamp: new Date(),
        images: [response.imageUrl],
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error editing image:', error);
      toast({
        title: "Failed to edit image",
        description: "There was an error editing the image",
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
      editImage,
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
