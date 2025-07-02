import { createDatabaseMCPServer } from '@/mcp/database-server';
import { createWebMCPServer } from '@/mcp/web-server';

// MCP servers
export let databaseServer: any = null;
export let webServer: any = null;

/**
 * Initialize MCP servers
 */
export async function initializeMCPServers() {
  try {
    console.log('Initializing MCP servers...');
    
    // Create database server
    databaseServer = createDatabaseMCPServer();
    await databaseServer.start();
    console.log('Database MCP server started');
    
    // Create web server
    webServer = createWebMCPServer();
    await webServer.start();
    console.log('Web MCP server started');
    
    console.log('All MCP servers initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing MCP servers:', error);
    return false;
  }
}

/**
 * Stop MCP servers
 */
export async function stopMCPServers() {
  try {
    console.log('Stopping MCP servers...');
    
    if (databaseServer) {
      await databaseServer.stop();
      console.log('Database MCP server stopped');
    }
    
    if (webServer) {
      await webServer.stop();
      console.log('Web MCP server stopped');
    }
    
    console.log('All MCP servers stopped successfully');
    return true;
  } catch (error) {
    console.error('Error stopping MCP servers:', error);
    return false;
  }
}

/**
 * Get MCP server status
 */
export function getMCPServerStatus() {
  return {
    databaseServer: databaseServer ? 'running' : 'stopped',
    webServer: webServer ? 'running' : 'stopped'
  };
}