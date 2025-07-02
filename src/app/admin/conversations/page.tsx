'use client';

import { useState, useEffect } from 'react';
import { Conversation } from '@/models/Conversation';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch conversations from API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (phoneNumber: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/conversations/${phoneNumber}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }
      
      // Remove conversation from state
      setConversations(conversations.filter(conv => conv.phoneNumber !== phoneNumber));
      
      // Clear selected conversation if it was deleted
      if (selectedConversation?.phoneNumber === phoneNumber) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Conversation History</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-4">Loading conversations...</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Conversation list */}
          <div className="w-full md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Customers</h2>
            
            {conversations.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <li 
                      key={conversation.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">+{conversation.phoneNumber}</p>
                          <p className="text-sm text-gray-500">
                            {conversation.messages.length} messages
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Last message:
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimestamp(conversation.updatedAt.toString())}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4 bg-white rounded-lg shadow">
                No conversations found.
              </div>
            )}
          </div>
          
          {/* Conversation detail */}
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedConversation 
                  ? `Conversation with +${selectedConversation.phoneNumber}`
                  : 'Select a conversation'
                }
              </h2>
              
              {selectedConversation && (
                <button
                  onClick={() => handleDeleteConversation(selectedConversation.phoneNumber)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            
            {selectedConversation ? (
              <div className="bg-white rounded-lg shadow p-4 h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm mb-1">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-75 text-right">
                          {formatTimestamp(message.timestamp.toString())}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-4 h-[600px] flex items-center justify-center text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}