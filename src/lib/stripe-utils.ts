import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  priceId: string
  features: string[]
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Up to 10 projects',
      'Basic analytics',
      'Email support',
      '2GB storage',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID!,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Team collaboration',
      'Custom integrations',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom onboarding',
      'Unlimited storage',
      'SSO integration',
      'Advanced security',
      'SLA guarantee',
    ],
  },
]

export const stripeUtils = {
  async createCheckoutSession(priceId: string, userId: string, tenantId: string) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        metadata: {
          userId,
          tenantId,
        },
        customer_email: undefined, // Will be filled by Stripe
      })

      return session
    } catch (error) {
      console.error('Stripe checkout session creation error:', error)
      throw error
    }
  },

  async createCustomerPortalSession(customerId: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      })

      return session
    } catch (error) {
      console.error('Stripe customer portal session creation error:', error)
      throw error
    }
  },

  async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Stripe subscription retrieval error:', error)
      throw error
    }
  },

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId)
      return subscription
    } catch (error) {
      console.error('Stripe subscription cancellation error:', error)
      throw error
    }
  },

  async constructWebhookEvent(body: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      return event
    } catch (error) {
      console.error('Stripe webhook signature verification failed:', error)
      throw error
    }
  },

  getPlanById(planId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.id === planId)
  },

  getPlanByPriceId(priceId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.priceId === priceId)
  },

  formatPrice(amount: number, currency = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  },
}

export { stripe }