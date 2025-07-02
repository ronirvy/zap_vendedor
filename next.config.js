/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  env: {
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    OLLAMA_API_URL: process.env.OLLAMA_API_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
    MCP_DATABASE_SERVER_PORT: process.env.MCP_DATABASE_SERVER_PORT,
    MCP_WEB_SERVER_PORT: process.env.MCP_WEB_SERVER_PORT,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('undici');
    }
    return config;
  },
}

module.exports = nextConfig