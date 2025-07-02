import { NextRequest, NextResponse } from 'next/server';
import { simulateIncomingMessage, getAllMockMessages, clearMockMessages } from '@/lib/whatsapp-mock';

/**
 * POST endpoint to simulate an incoming WhatsApp message
 * This is only for testing purposes when you don't have a real WhatsApp Business API integration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.phoneNumber || !body.message) {
      return new NextResponse(
        JSON.stringify({ error: 'phoneNumber and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Simulate receiving a message
    await simulateIncomingMessage(body.phoneNumber, body.message);
    
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Message processed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in test-whatsapp endpoint:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET endpoint to retrieve all mock messages
 * This is only for testing purposes
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    // Clear all mock messages if action=clear
    if (action === 'clear') {
      clearMockMessages();
      return new NextResponse(
        JSON.stringify({ success: true, message: 'All mock messages cleared' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get all mock messages
    const messages = getAllMockMessages();
    
    return new NextResponse(
      JSON.stringify({ messages }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in test-whatsapp endpoint:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}