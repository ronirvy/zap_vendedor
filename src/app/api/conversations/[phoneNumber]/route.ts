import { NextRequest, NextResponse } from 'next/server';
import { getConversationByPhoneNumber, getRecentMessages, deleteConversation } from '@/models/Conversation';

interface Params {
  params: {
    phoneNumber: string;
  };
}

// GET /api/conversations/[phoneNumber] - Get a conversation by phone number
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { phoneNumber } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    
    // If limit is provided, get recent messages
    if (limit) {
      const messages = getRecentMessages(phoneNumber, parseInt(limit));
      return NextResponse.json(messages);
    }
    
    // Otherwise, get the full conversation
    const conversation = getConversationByPhoneNumber(phoneNumber);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    return NextResponse.json({ error: 'Failed to get conversation' }, { status: 500 });
  }
}

// DELETE /api/conversations/[phoneNumber] - Delete a conversation
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { phoneNumber } = params;
    const success = deleteConversation(phoneNumber);
    
    if (!success) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
  }
}