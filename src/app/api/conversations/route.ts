import { NextRequest, NextResponse } from 'next/server';
import { getAllConversations, addMessage, clearAllConversations } from '@/models/Conversation';

// GET /api/conversations - Get all conversations
export async function GET(request: NextRequest) {
  try {
    const conversations = getAllConversations();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    return NextResponse.json({ error: 'Failed to get conversations' }, { status: 500 });
  }
}

// POST /api/conversations - Add a message to a conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['phoneNumber', 'role', 'content'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    
    // Validate role
    if (body.role !== 'user' && body.role !== 'assistant') {
      return NextResponse.json({ error: 'Role must be either "user" or "assistant"' }, { status: 400 });
    }
    
    const message = addMessage(body.phoneNumber, body.role, body.content);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}

// DELETE /api/conversations - Clear all conversations
export async function DELETE(request: NextRequest) {
  try {
    clearAllConversations();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing conversations:', error);
    return NextResponse.json({ error: 'Failed to clear conversations' }, { status: 500 });
  }
}