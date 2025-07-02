export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  phoneNumber: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory conversation store (replace with database in production)
let conversations: Conversation[] = [];

// Conversation service functions
export function getConversationByPhoneNumber(phoneNumber: string): Conversation | undefined {
  return conversations.find(conversation => conversation.phoneNumber === phoneNumber);
}

export function getAllConversations(): Conversation[] {
  return conversations;
}

export function addMessage(phoneNumber: string, role: 'user' | 'assistant', content: string): Message {
  // Find existing conversation or create a new one
  let conversation = getConversationByPhoneNumber(phoneNumber);
  
  if (!conversation) {
    conversation = {
      id: Date.now().toString(),
      phoneNumber,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    conversations.push(conversation);
  }
  
  // Create new message
  const message: Message = {
    id: Date.now().toString(),
    role,
    content,
    timestamp: new Date()
  };
  
  // Add message to conversation
  conversation.messages.push(message);
  conversation.updatedAt = new Date();
  
  return message;
}

export function getRecentMessages(phoneNumber: string, limit: number = 10): Message[] {
  const conversation = getConversationByPhoneNumber(phoneNumber);
  
  if (!conversation) return [];
  
  // Return the most recent messages
  return conversation.messages.slice(-limit);
}

export function deleteConversation(phoneNumber: string): boolean {
  const initialLength = conversations.length;
  conversations = conversations.filter(conversation => conversation.phoneNumber !== phoneNumber);
  return conversations.length < initialLength;
}

export function clearAllConversations(): void {
  conversations = [];
}