import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'All Things Distributed',
  description: 'Werner Vogels on building scalable and robust distributed systems',
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

