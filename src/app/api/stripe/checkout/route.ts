import { NextRequest, NextResponse } from 'next/server'
import { stripeUtils } from '@/lib/stripe-utils'
import { authUtils } from '@/lib/auth-utils'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Check if we're in build time (no runtime auth available)
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

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