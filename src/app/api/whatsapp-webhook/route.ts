import { NextRequest, NextResponse } from 'next/server';
// Import from mock implementation instead of real implementation
import { processMessage } from '@/lib/whatsapp-mock';

// Environment variables (to be set in .env.local)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token';

// Flag to determine if we're using the mock implementation
const USE_MOCK = !process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN === 'your_access_token';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      return new NextResponse(challenge, { status: 200 });
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return new NextResponse('Bad Request', { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a WhatsApp message event
    if (body.object === 'whatsapp_business_account') {
      // Process each entry
      for (const entry of body.entry) {
        // Process each change in the entry
        for (const change of entry.changes) {
          // Check if this is a message
          if (
            change.field === 'messages' && 
            change.value && 
            change.value.messages && 
            change.value.messages.length > 0
          ) {
            // Process each message
            for (const message of change.value.messages) {
              if (message.type === 'text') {
                const phoneNumber = change.value.contacts[0].wa_id;
                const messageText = message.text.body;
                
                // Process the message and get a response
                await processMessage(phoneNumber, messageText);
              }
            }
          }
        }
      }
      
      // Return a 200 OK response to acknowledge receipt
      return new NextResponse('OK', { status: 200 });
    }
    
    // Not a WhatsApp message event
    return new NextResponse('Not a WhatsApp message', { status: 400 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}