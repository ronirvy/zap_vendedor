import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/ollama';

// POST /api/ollama - Get AI response (server-side only)
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();
    if (!phoneNumber || !message) {
      return NextResponse.json({ error: 'Missing phoneNumber or message' }, { status: 400 });
    }
    const aiResponse = await getAIResponse(phoneNumber, message);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in /api/ollama:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
