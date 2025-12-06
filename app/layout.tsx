import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'All Things Blog',
  description: 'A blog about all things',
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

