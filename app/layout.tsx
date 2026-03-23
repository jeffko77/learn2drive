import type { Metadata } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Learn2Drive - Teen Driver Training Tracker',
  description: 'Track driving skills progress for teen drivers',
  manifest: '/manifest.json',
  themeColor: '#070d1a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="max-w-2xl mx-auto min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
