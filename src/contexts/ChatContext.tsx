
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageProps, FactionType } from '@/components/ChatMessage';
import { useToast } from '@/components/ui/use-toast';

// This is a mock AI response function since we can't actually integrate with the model
const mockGenerateResponse = async (
  prompt: string, 
  faction: FactionType,
  images?: File[]
): Promise<{ text: string, generatedImages?: string[] }> => {
  // In a real implementation, this would call your AI API
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  const factionResponses = {
    blue: "I analyze all situations objectively. Based on the facts presented, I suggest a logical approach to this problem.",
    red: "Let's take immediate action! We don't have time to waste with lengthy deliberations.",
    green: "I see multiple creative solutions to this challenge. Let's explore alternatives before deciding.",
    purple: "I sense deeper patterns at work here. There may be hidden aspects to consider before proceeding.",
  };
  
  // Handle image generation mock
  let generatedImages: string[] = [];
  if (images && images.length > 0) {
    // In a real implementation, you would process these images with your AI
    // Here we just return the same images as placeholders for generated content
    generatedImages = images.map(img => URL.createObjectURL(img));
  }
  
  const baseResponse = faction !== 'user' ? factionResponses[faction] : "";
  
  // Add some markdown formatting to simulate AI response with code if the prompt mentions code
  let response = baseResponse;
  if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('```')) {
    response += "\n\n```javascript\n// Here's a code example\nfunction example() {\n  console.log('Hello from the " + faction + " faction!');\n}\n```";
  }
  
  // Add some markdown formatting to simulate AI response with a list if the prompt asks for suggestions
  if (prompt.toLowerCase().includes('suggest') || prompt.toLowerCase().includes('list')) {
    response += "\n\n* First suggestion\n* Second suggestion\n* Third suggestion";
  }
  
  // Add a message about images if they were included
  if (images && images.length > 0) {
    response += "\n\nI've analyzed the images you provided and generated some alternatives based on them.";
  }
  
  return { text: response, generatedImages };
};

interface ChatContextType {
  messages: MessageProps[];
  selectedFaction: FactionType;
  setSelectedFaction: (faction: FactionType) => void;
  sendMessage: (content: string, images?: File[]) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [selectedFaction, setSelectedFaction] = useState<FactionType>('blue');
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
      const response = await mockGenerateResponse(content, selectedFaction, images);
      
      // Add AI response
      const aiMessage: MessageProps = {
        content: response.text,
        sender: selectedFaction,
        timestamp: new Date(),
        images: response.generatedImages,
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

  return (
    <ChatContext.Provider value={{ 
      messages, 
      selectedFaction, 
      setSelectedFaction, 
      sendMessage,
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
