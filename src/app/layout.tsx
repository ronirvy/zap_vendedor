import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MCPInitializer from '@/components/MCPInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ZapVendedor - WhatsApp Sales Assistant',
  description: 'WhatsApp chatbot with local AI for product recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MCPInitializer />
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  )
}