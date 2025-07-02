'use client';

import { useEffect } from 'react';
import { initializeMCPServers } from '@/lib/mcp';

export default function MCPInitializer() {
  useEffect(() => {
    const initMCP = async () => {
      try {
        console.log('Initializing MCP servers from component...');
        await initializeMCPServers();
        console.log('MCP servers initialized successfully');
      } catch (error) {
        console.error('Failed to initialize MCP servers:', error);
      }
    };

    initMCP();

    // Cleanup function to stop MCP servers when component unmounts
    return () => {
      const stopMCP = async () => {
        try {
          const { stopMCPServers } = require('@/lib/mcp');
          await stopMCPServers();
          console.log('MCP servers stopped successfully');
        } catch (error) {
          console.error('Failed to stop MCP servers:', error);
        }
      };

      stopMCP();
    };
  }, []);

  // This component doesn't render anything
  return null;
}