import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'all things blog',
  description: 'all things blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

