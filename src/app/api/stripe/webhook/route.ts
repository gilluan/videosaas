import { NextRequest, NextResponse } from 'next/server'
import { stripeUtils } from '@/lib/stripe-utils'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../../../../../amplify/data/resource'
import Stripe from 'stripe'

// Helper function to get client safely
function getGraphQLClient() {
  // Don't try to create client during build process
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return null
  }
  return generateClient<Schema>()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    // Check if GraphQL client is available (not during build)
    const client = getGraphQLClient()
    if (!client) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Verify webhook signature
    const event = await stripeUtils.constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract metadata
        const { userId, tenantId } = session.metadata || {}
        const subscriptionId = session.subscription
        const customerId = session.customer

        // Update user's subscription in database
        await client.graphql({
          query: `
            mutation CreateSubscription($input: CreateSubscriptionInput!) {
              createSubscription(input: $input) {
                id
                userId
                stripeSubscriptionId
                stripeCustomerId
                status
                currentPeriodStart
                currentPeriodEnd
              }
            }
          `,
          variables: {
            input: {
              userId,
              tenantId,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              status: 'ACTIVE',
              currentPeriodStart: new Date(session.created * 1000).toISOString(),
              currentPeriodEnd: new Date((session.created + 30 * 24 * 60 * 60) * 1000).toISOString(), // 30 days from now
            }
          }
        })

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription

        // Update subscription status
        await client.graphql({
          query: `
            mutation UpdateSubscriptionStatus($input: UpdateSubscriptionInput!) {
              updateSubscription(input: $input) {
                id
                status
                currentPeriodEnd
              }
            }
          `,
          variables: {
            input: {
              stripeSubscriptionId: subscriptionId,
              status: 'ACTIVE',
              currentPeriodEnd: new Date(invoice.period_end * 1000).toISOString(),
            }
          }
        })

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription

        // Update subscription status to past due
        await client.graphql({
          query: `
            mutation UpdateSubscriptionStatus($input: UpdateSubscriptionInput!) {
              updateSubscription(input: $input) {
                id
                status
              }
            }
          `,
          variables: {
            input: {
              stripeSubscriptionId: subscriptionId,
              status: 'PAST_DUE',
            }
          }
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription status to cancelled
        await client.graphql({
          query: `
            mutation UpdateSubscriptionStatus($input: UpdateSubscriptionInput!) {
              updateSubscription(input: $input) {
                id
                status
                canceledAt
              }
            }
          `,
          variables: {
            input: {
              stripeSubscriptionId: subscription.id,
              status: 'CANCELLED',
              canceledAt: new Date().toISOString(),
            }
          }
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}