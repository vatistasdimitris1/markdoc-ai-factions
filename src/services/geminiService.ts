import { toast } from "@/components/ui/use-toast";

const API_KEY = "AIzaSyCcovcQodNQl4vX5G3wHOFHWo2xM7vIav0";

interface GeminiTextResponse {
  text: string;
  images?: string[];
}

interface GeminiImageGenerationResponse {
  imageUrl: string;
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const geminiService = {
  async generateText(
    prompt: string, 
    images: File[] = [], 
    conversationHistory: ConversationMessage[] = []
  ): Promise<GeminiTextResponse> {
    try {
      // For client-side usage, we need to convert images to base64
      const imageContents = await Promise.all(
        images.map(async (image) => {
          return {
            mimeType: image.type,
            data: await fileToBase64(image)
          };
        })
      );

      // Prepare contents including conversation history and system message
      const contents = [];
      
      // Add system message to identify the AI
      contents.push({
        role: 'system',
        parts: [{ text: "You are CodX AI, a helpful assistant created by vatistasdimitris." }]
      });
      
      // Add conversation history if provided
      if (conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.content }]
          });
        });
      }
      
      // Add the current user message
      contents.push({
        role: 'user',
        parts: [
          { text: prompt },
          ...imageContents.map(img => ({ inlineData: img }))
        ]
      });

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate text");
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No response generated");
      }

      // Extract text and any generated images
      const textParts: string[] = [];
      const imageParts: string[] = [];

      data.candidates[0].content.parts.forEach((part: any) => {
        if (part.text) {
          textParts.push(part.text);
        }
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          imageParts.push(imageUrl);
        }
      });

      return {
        text: textParts.join("\n"),
        images: imageParts.length > 0 ? imageParts : undefined
      };
    } catch (error) {
      console.error("Error generating text:", error);
      toast({
        title: "Error generating response",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  },

  async generateImage(prompt: string): Promise<GeminiImageGenerationResponse> {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=" + API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseModalities: ["image", "text"],
            responseMimeType: "text/plain",
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No image generated");
      }

      // Extract the image data from the response
      let imageUrl = "";
      
      for (const candidate of data.candidates) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
        if (imageUrl) break;
      }

      if (!imageUrl) {
        throw new Error("No image found in response");
      }

      return { imageUrl };
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error generating image",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  },

  async editImage(prompt: string, image: File): Promise<GeminiImageGenerationResponse> {
    try {
      // Convert the image to base64
      const imageData = await fileToBase64(image);
      
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=" + API_KEY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: prompt 
                },
                {
                  inlineData: {
                    mimeType: image.type,
                    data: imageData
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseModalities: ["image", "text"],
            responseMimeType: "text/plain",
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to edit image");
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error("No edited image generated");
      }

      // Extract the image data from the response
      let imageUrl = "";
      
      for (const candidate of data.candidates) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
        if (imageUrl) break;
      }

      if (!imageUrl) {
        throw new Error("No edited image found in response");
      }

      return { imageUrl };
    } catch (error) {
      console.error("Error editing image:", error);
      toast({
        title: "Error editing image",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
};
