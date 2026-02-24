import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lux — TIAFT x NotebookLM Prompt Builder',
  description: 'Illuminate. Ground. Reveal. A grounded NotebookLM RAG prompt builder for TIAFT 2026.',
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
