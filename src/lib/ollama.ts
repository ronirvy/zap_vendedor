import axios from 'axios';
import { storeConversation } from './whatsapp';
import { Client } from './mcp-mock';
import { initializeMCPServers } from './mcp';

// Environment variables (to be set in .env.local)
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2-chat';

// Store conversation history for each user
const conversationHistory: Record<string, Array<{ role: string; content: string }>> = {};

// Create MCP client
const mcpClient = new Client();

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
Always try to recommend relevant products based on the customer's needs.

You have access to the following tools:
1. search-products: Search for products by query
2. filter-products: Filter products by category, brand, and/or price
3. get-product: Get a product by ID
4. web-search: Search the web for information
5. scrape-webpage: Scrape content from a webpage
6. compare-prices: Compare prices of a product across different websites

Use these tools to provide accurate and helpful information to the customer.`;
    
    // Try to get relevant product information based on the message
    let productContext = '';
    try {
      // Initialize MCP servers if needed
      await initializeMCPServers();
      
      // Import the MCP module to access server instances
      const mcp = await import('./mcp');
      
      // Connect to MCP servers if not already connected
      if (mcpClient.servers.length === 0 && mcp.databaseServer && mcp.webServer) {
        // Connect to database server
        mcpClient.connectToServer(mcp.databaseServer);
        
        // Connect to web server
        mcpClient.connectToServer(mcp.webServer);
      }
      
      // Search for products related to the message
      const searchResult = await mcpClient.executeTool('database-server', 'search-products', {
        query: message
      });
      
      if (searchResult.products && searchResult.products.length > 0) {
        // Format product information for context
        productContext = '\n\nRelevant products:\n' +
          searchResult.products.slice(0, 3).map((product: any) =>
            `- ${product.name}: ${product.description} - $${product.price}`
          ).join('\n');
      }
    } catch (error) {
      console.error('Error getting product context:', error);
      // Continue without product context if there's an error
    }
    
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
    
    // Store conversation in database
    await storeConversation(phoneNumber, message, aiResponse);
    
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