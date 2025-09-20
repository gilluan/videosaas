import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { StripeProvider } from '@/lib/stripe-context'
import '@/lib/amplify-config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VideoSaaS - Modern Video Platform',
  description: 'Professional video management and streaming platform for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StripeProvider>
            {children}
          </StripeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}