import { getAIResponse } from './ollama';

// In-memory storage for mock conversations
interface MockMessage {
  phoneNumber: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Store mock messages in memory
const mockMessages: MockMessage[] = [];

/**
 * Process an incoming message (mock implementation)
 * @param phoneNumber The sender's phone number
 * @param message The message text
 */
export async function processMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    console.log(`[MOCK] Processing message from ${phoneNumber}: ${message}`);
    
    // Store the user message
    storeMessage(phoneNumber, 'user', message);
    
    // Get response from AI
    const aiResponse = await getAIResponse(phoneNumber, message);
    
    // Send response back (mock)
    await sendWhatsAppMessage(phoneNumber, aiResponse);
    
    console.log(`[MOCK] Sent response to ${phoneNumber}: ${aiResponse}`);
  } catch (error) {
    console.error('[MOCK] Error processing message:', error);
    throw error;
  }
}

/**
 * Send a message to a WhatsApp user (mock implementation)
 * @param phoneNumber The recipient's phone number
 * @param message The message to send
 */
export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
  try {
    console.log(`[MOCK] Sending WhatsApp message to ${phoneNumber}: ${message}`);
    
    // Store the assistant message
    storeMessage(phoneNumber, 'assistant', message);
    
    // Simulate a delay to mimic network latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve();
  } catch (error) {
    console.error('[MOCK] Error sending WhatsApp message:', error);
    throw error;
  }
}

/**
 * Store a message in the mock storage
 * @param phoneNumber The user's phone number
 * @param role The role (user or assistant)
 * @param content The message content
 */
function storeMessage(
  phoneNumber: string,
  role: 'user' | 'assistant',
  content: string
): void {
  mockMessages.push({
    phoneNumber,
    role,
    content,
    timestamp: new Date()
  });
  
  console.log(`[MOCK] Stored ${role} message for ${phoneNumber}`);
}

/**
 * Get all messages for a specific phone number
 * @param phoneNumber The phone number to get messages for
 */
export function getMessagesForPhoneNumber(phoneNumber: string): MockMessage[] {
  return mockMessages.filter(msg => msg.phoneNumber === phoneNumber);
}

/**
 * Get all mock messages
 */
export function getAllMockMessages(): MockMessage[] {
  return [...mockMessages];
}

/**
 * Simulate receiving a message from a user (for testing)
 * @param phoneNumber The sender's phone number
 * @param message The message text
 */
export async function simulateIncomingMessage(phoneNumber: string, message: string): Promise<void> {
  console.log(`[MOCK] Simulating incoming message from ${phoneNumber}: ${message}`);
  return processMessage(phoneNumber, message);
}

/**
 * Clear all mock messages (for testing)
 */
export function clearMockMessages(): void {
  mockMessages.length = 0;
  console.log('[MOCK] Cleared all mock messages');
}