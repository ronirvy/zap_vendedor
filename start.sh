#!/bin/bash

# Start Ollama server
echo "Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to start
echo "Waiting for Ollama to start..."
sleep 5

# Check if the model is available
echo "Checking if the model is available..."
MODEL=$(grep OLLAMA_MODEL .env.local | cut -d '=' -f2)
if [ -z "$MODEL" ]; then
  MODEL="llama2-chat"
fi

# Pull the model if it's not available
if ! ollama list | grep -q "$MODEL"; then
  echo "Model $MODEL not found. Pulling..."
  ollama pull $MODEL
fi

# Start the Next.js application
echo "Starting Next.js application..."
npm run dev &
NEXTJS_PID=$!

# Function to handle cleanup
cleanup() {
  echo "Shutting down..."
  kill $NEXTJS_PID
  kill $OLLAMA_PID
  exit 0
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "ZapVendedor is running. Press Ctrl+C to stop."
wait $NEXTJS_PID