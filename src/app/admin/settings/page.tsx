'use client';

import { useState, useEffect } from 'react';
import { checkOllamaStatus } from '@/lib/ollama';
import { getMCPServerStatus, initializeMCPServers, stopMCPServers } from '@/lib/mcp';

export default function SettingsPage() {
  const [whatsappSettings, setWhatsappSettings] = useState({
    phoneNumberId: '',
    accessToken: '',
    verifyToken: ''
  });
  
  const [ollamaSettings, setOllamaSettings] = useState({
    apiUrl: 'http://localhost:11434',
    model: 'llama2-chat'
  });
  
  const [ollamaStatus, setOllamaStatus] = useState<boolean | null>(null);
  const [mcpStatus, setMcpStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load WhatsApp settings
        const savedWhatsappSettings = localStorage.getItem('whatsappSettings');
        if (savedWhatsappSettings) {
          setWhatsappSettings(JSON.parse(savedWhatsappSettings));
        }
        
        // Load Ollama settings
        const savedOllamaSettings = localStorage.getItem('ollamaSettings');
        if (savedOllamaSettings) {
          setOllamaSettings(JSON.parse(savedOllamaSettings));
        }
        
        // Check Ollama status
        checkOllamaStatus().then(status => {
          setOllamaStatus(status);
        });
        
        // Check MCP status
        setMcpStatus(getMCPServerStatus());
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Handle WhatsApp settings change
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWhatsappSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Ollama settings change
  const handleOllamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOllamaSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save settings
  const handleSaveSettings = () => {
    try {
      // Save WhatsApp settings
      localStorage.setItem('whatsappSettings', JSON.stringify(whatsappSettings));
      
      // Save Ollama settings
      localStorage.setItem('ollamaSettings', JSON.stringify(ollamaSettings));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    }
  };

  // Check Ollama status
  const handleCheckOllamaStatus = async () => {
    setLoading(true);
    try {
      const status = await checkOllamaStatus();
      setOllamaStatus(status);
      setMessage({ 
        type: status ? 'success' : 'error', 
        text: status 
          ? 'Ollama is running and the model is available!' 
          : 'Ollama is not running or the model is not available.' 
      });
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setMessage({ type: 'error', text: 'Failed to check Ollama status. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Start MCP servers
  const handleStartMCPServers = async () => {
    setLoading(true);
    try {
      const success = await initializeMCPServers();
      setMcpStatus(getMCPServerStatus());
      setMessage({ 
        type: success ? 'success' : 'error', 
        text: success 
          ? 'MCP servers started successfully!' 
          : 'Failed to start MCP servers.' 
      });
    } catch (error) {
      console.error('Error starting MCP servers:', error);
      setMessage({ type: 'error', text: 'Failed to start MCP servers. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Stop MCP servers
  const handleStopMCPServers = async () => {
    setLoading(true);
    try {
      const success = await stopMCPServers();
      setMcpStatus(getMCPServerStatus());
      setMessage({ 
        type: success ? 'success' : 'error', 
        text: success 
          ? 'MCP servers stopped successfully!' 
          : 'Failed to stop MCP servers.' 
      });
    } catch (error) {
      console.error('Error stopping MCP servers:', error);
      setMessage({ type: 'error', text: 'Failed to stop MCP servers. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WhatsApp Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">WhatsApp Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number ID
              </label>
              <input
                type="text"
                name="phoneNumberId"
                value={whatsappSettings.phoneNumberId}
                onChange={handleWhatsappChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your WhatsApp Phone Number ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token
              </label>
              <input
                type="password"
                name="accessToken"
                value={whatsappSettings.accessToken}
                onChange={handleWhatsappChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your WhatsApp Access Token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verify Token
              </label>
              <input
                type="text"
                name="verifyToken"
                value={whatsappSettings.verifyToken}
                onChange={handleWhatsappChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter your WhatsApp Verify Token"
              />
            </div>
          </div>
        </div>
        
        {/* Ollama Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Ollama Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API URL
              </label>
              <input
                type="text"
                name="apiUrl"
                value={ollamaSettings.apiUrl}
                onChange={handleOllamaChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter Ollama API URL"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={ollamaSettings.model}
                onChange={handleOllamaChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter Ollama model name"
              />
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleCheckOllamaStatus}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
              >
                Check Status
              </button>
              
              {ollamaStatus !== null && (
                <span className={`ml-2 ${ollamaStatus ? 'text-green-600' : 'text-red-600'}`}>
                  {ollamaStatus ? 'Connected' : 'Not Connected'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* MCP Servers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">MCP Servers</h2>
          
          {mcpStatus && (
            <div className="mb-4">
              <p className="mb-2">
                <span className="font-medium">Database Server:</span>{' '}
                <span className={mcpStatus.databaseServer === 'running' ? 'text-green-600' : 'text-red-600'}>
                  {mcpStatus.databaseServer}
                </span>
              </p>
              <p>
                <span className="font-medium">Web Server:</span>{' '}
                <span className={mcpStatus.webServer === 'running' ? 'text-green-600' : 'text-red-600'}>
                  {mcpStatus.webServer}
                </span>
              </p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              onClick={handleStartMCPServers}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Start Servers
            </button>
            
            <button
              onClick={handleStopMCPServers}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop Servers
            </button>
          </div>
        </div>
        
        {/* Save Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Save Configuration</h2>
          <p className="mb-4 text-gray-600">
            Save your settings to local storage. These settings will be used by the application to connect to WhatsApp and Ollama.
          </p>
          
          <button
            onClick={handleSaveSettings}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}