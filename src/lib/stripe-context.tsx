'use client'

import React, { createContext, useContext } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface StripeContextType {
  createCheckoutSession: (priceId: string, userId: string) => Promise<void>
  stripe: Promise<Stripe | null>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const createCheckoutSession = async (priceId: string, userId: string) => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      throw error
    }
  }

  const value: StripeContextType = {
    createCheckoutSession,
    stripe: stripePromise,
  }

  return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
}

export function useStripe() {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}