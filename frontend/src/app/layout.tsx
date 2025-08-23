import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Learn English - AI-Powered English Learning Platform',
  description: 'Master English with AI assistance, listening practice, grammar lessons, and TOEIC/IELTS preparation',
  keywords: ['English learning', 'AI tutor', 'TOEIC', 'IELTS', 'Grammar', 'Listening practice'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
