'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  phoneNumber: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TestWhatsApp() {
  const [phoneNumber, setPhoneNumber] = useState('5511999999999');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch messages on load and periodically
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all mock messages
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/test-whatsapp');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a test message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !message) return;

    setLoading(true);
    try {
      const response = await fetch('/api/test-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      if (response.ok) {
        setMessage('');
        await fetchMessages();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Clear all messages
  const clearMessages = async () => {
    try {
      await fetch('/api/test-whatsapp?action=clear');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Mock Tester</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
        <form onSubmit={sendMessage} className="space-y-4">
          <div>
            <label className="block mb-1">Phone Number:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="5511999999999"
            />
          </div>
          <div>
            <label className="block mb-1">Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Type your message here..."
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            <button
              type="button"
              onClick={clearMessages}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All Messages
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Conversation History</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <div className="border rounded p-4 space-y-4 max-h-96 overflow-y-auto">
            {messages
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-blue-100 ml-auto'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {msg.role === 'user' ? 'User' : 'Assistant'} ({msg.phoneNumber})
                  </div>
                  <div>{msg.content}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}