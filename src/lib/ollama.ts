import axios from 'axios';

// Environment variables (to be set in .env.local)
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2-chat';

// Store conversation history for each user
const conversationHistory: Record<string, Array<{ role: string; content: string }>> = {};

/**
 * Get a response from the AI model
 * @param phoneNumber The user's phone number (used as conversation ID)
 * @param message The user's message
 * @returns The AI's response
 */
export async function getAIResponse(phoneNumber: string, message: string): Promise<string> {
  try {
    // Initialize conversation history if it doesn't exist
    if (!conversationHistory[phoneNumber]) {
      conversationHistory[phoneNumber] = [];
    }
    
    // Add user message to history
    conversationHistory[phoneNumber].push({
      role: 'user',
      content: message
    });
    
    // Prepare system prompt with MCP server information
    const systemPrompt = `You are a helpful sales assistant for an electronics store.
Your name is ZapVendedor. You help customers find products like phones, laptops, and accessories.
Be friendly, concise, and helpful. If you don't know something, say so.
Always try to recommend relevant products based on the customer's needs.`;
    
    // Don't fetch product context via MCP on client-side anymore
    let productContext = '';
    
    // Make request to Ollama API with enhanced context
    const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
      model: OLLAMA_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt + productContext
        },
        ...conversationHistory[phoneNumber]
      ],
      stream: false
    });
    
    // Extract AI response
    const aiResponse = response.data.message.content;
    
    // Add AI response to history
    conversationHistory[phoneNumber].push({
      role: 'assistant',
      content: aiResponse
    });
    
    // Limit conversation history to last 10 messages to prevent context overflow
    if (conversationHistory[phoneNumber].length > 10) {
      conversationHistory[phoneNumber] = conversationHistory[phoneNumber].slice(-10);
    }
    
    return aiResponse;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

/**
 * Check if Ollama is running and the model is available
 * @returns True if Ollama is running and the model is available
 */
export async function checkOllamaStatus(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    const models = response.data.models || [];
    
    // Check if our model is available
    return models.some((model: any) => model.name === OLLAMA_MODEL);
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    return false;
  }
}