# ZapVendedor - WhatsApp Sales Assistant

A WhatsApp chatbot application that uses local AI (Ollama) and MCP (Model Context Protocol) to provide product recommendations and answer customer questions.

## Features

- WhatsApp Business API integration for sending and receiving messages
- Local AI using Ollama for natural language processing
- MCP (Model Context Protocol) for structured AI interactions with external data sources
- Product catalog management
- Conversation history tracking
- Admin dashboard for managing products and viewing conversations

## Tech Stack

- **Frontend/Backend**: Next.js (React + Node.js)
- **Database**: In-memory storage (can be replaced with a real database)
- **WhatsApp Integration**: WhatsApp Business Cloud API
- **AI**: Ollama with LLaMA2 model (or similar)
- **Protocol**: Model Context Protocol (MCP)

## Prerequisites

- Node.js (v18 or later)
- Ollama installed locally (https://ollama.ai/)
- WhatsApp Business API credentials
- LLaMA2 model or similar downloaded via Ollama

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/zap_vendedor.git
   cd zap_vendedor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the values with your WhatsApp Business API credentials

4. Start Ollama:
   ```
   ollama serve
   ```

5. Pull the LLaMA2 model (or your preferred model):
   ```
   ollama pull llama2-chat
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to access the admin dashboard.

## WhatsApp Business API Setup

1. Create a Meta Developer account and set up a WhatsApp Business app
2. Configure the webhook URL to point to your application's `/api/whatsapp-webhook` endpoint
3. Set the verify token in your `.env.local` file to match the one you configured in the Meta Developer Portal
4. Add your WhatsApp Business phone number ID and access token to the `.env.local` file

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/app/api` - API endpoints for WhatsApp webhook, products, and conversations
- `/src/app/admin` - Admin dashboard pages
- `/src/components` - React components
- `/src/lib` - Utility functions and services
- `/src/models` - Data models
- `/src/mcp` - MCP server implementations

## MCP Servers

The application uses two MCP servers:

1. **Database Server**: Provides tools for the AI to query the product database
2. **Web Server**: Provides tools for the AI to search the web and scrape information

### Mock MCP Implementation

This project includes a mock implementation of the Model Context Protocol (MCP) in `src/lib/mcp-mock.ts`. This mock implementation provides the core functionality needed for the AI to interact with external data sources:

- **Server**: Creates MCP servers that provide tools and resources
- **Resource**: Represents data sources that can be accessed by the AI
- **Tool**: Represents functions that can be executed by the AI
- **Client**: Connects to MCP servers and executes tools or fetches resources

The mock implementation is used because the official `@anthropic-ai/mcp` package is not publicly available yet. When the official package becomes available, you can replace the mock implementation with the real one.

## Usage

1. Start the application and configure the settings in the admin dashboard
2. Connect your WhatsApp Business account
3. Start the Ollama server and MCP servers
4. Customers can now send messages to your WhatsApp Business number
5. The AI will process the messages, search for relevant products, and respond with recommendations

## License

MIT