import { NextRequest, NextResponse } from 'next/server'
import { stripeUtils } from '@/lib/stripe-utils'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Skip auth check during build/static generation
    if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_ENV) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Dynamically import auth utils to prevent build-time loading
    const { authUtils } = await import('@/lib/auth-utils')

    // Verify the user exists and get their tenant ID
    const user = await authUtils.getCurrentUser()
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Create Stripe checkout session
    const session = await stripeUtils.createCheckoutSession(
      priceId,
      userId,
      user.tenantId
    )

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout API error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}