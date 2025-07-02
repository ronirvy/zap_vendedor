import axios from 'axios';
import { getAIResponse } from './ollama';

// Environment variables (to be set in .env.local)
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

/**
 * Process an incoming message from WhatsApp
 * @param phoneNumber The sender's phone number
 * @param message The message text
 */
export async function processMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    console.log(`Processing message from ${phoneNumber}: ${message}`);
    
    // Get response from AI
    const aiResponse = await getAIResponse(phoneNumber, message);
    
    // Send response back to WhatsApp
    await sendWhatsAppMessage(phoneNumber, aiResponse);
    
    console.log(`Sent response to ${phoneNumber}: ${aiResponse}`);
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}

/**
 * Send a message to a WhatsApp user
 * @param phoneNumber The recipient's phone number
 * @param message The message to send
 */
export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phoneNumber,
        type: 'text',
        text: {
          body: message,
          preview_url: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}

/**
 * Store a conversation in the database
 * @param phoneNumber The user's phone number
 * @param userMessage The user's message
 * @param aiResponse The AI's response
 */
export async function storeConversation(
  phoneNumber: string, 
  userMessage: string, 
  aiResponse: string
): Promise<void> {
  // TODO: Implement database storage
  console.log(`Storing conversation for ${phoneNumber}`);
  console.log(`User: ${userMessage}`);
  console.log(`AI: ${aiResponse}`);
}