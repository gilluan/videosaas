import { type ClientSchema, a, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  // User model with Google OAuth support
  User: a
    .model({
      email: a.string().required(),
      name: a.string().required(),
      avatar: a.string(),
      tenantId: a.string().required(),
      subscriptionId: a.string(),
      authProvider: a.enum(['EMAIL', 'GOOGLE', 'LINKED']),
      googleId: a.string(),
      emailVerified: a.boolean().required().default(false),
      subscription: a.belongsTo('Subscription', 'subscriptionId'),
      settings: a.hasOne('UserSettings', 'userId'),
      metrics: a.hasMany('DashboardMetrics', 'userId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ])
    .secondaryIndexes((index) => [
      index('tenantId').name('byTenant'),
      index('email').name('byEmail'),
      index('googleId').name('byGoogleId'),
    ]),

  // Subscription model
  Subscription: a
    .model({
      userId: a.string().required(),
      tenantId: a.string().required(),
      stripeSubscriptionId: a.string().required(),
      stripePriceId: a.string().required(),
      status: a.enum(['ACTIVE', 'CANCELED', 'PAST_DUE', 'INCOMPLETE', 'TRIALING']),
      currentPeriodStart: a.datetime().required(),
      currentPeriodEnd: a.datetime().required(),
      cancelAtPeriodEnd: a.boolean().required().default(false),
      user: a.belongsTo('User', 'userId'),
    })
    .authorization((allow) => [
      allow.owner('userId'),
      allow.authenticated().to(['read']),
    ])
    .secondaryIndexes((index) => [
      index('userId').name('byUser'),
      index('tenantId').name('byTenant'),
    ]),

  // Subscription Plan model
  SubscriptionPlan: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      stripePriceId: a.string().required(),
      price: a.integer().required(),
      currency: a.string().required().default('USD'),
      interval: a.enum(['MONTHLY', 'YEARLY']),
      features: a.string().array().required(),
      maxUsers: a.integer(),
      maxProjects: a.integer(),
      priority: a.integer().required(),
      active: a.boolean().required().default(true),
    })
    .authorization((allow) => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'update', 'delete']),
    ])
    .secondaryIndexes((index) => [
      index('active').name('byActive'),
      index('priority').name('byPriority'),
    ]),

  // User Settings model
  UserSettings: a
    .model({
      userId: a.string().required(),
      tenantId: a.string().required(),
      theme: a.enum(['LIGHT', 'DARK', 'SYSTEM']).default('SYSTEM'),
      notifications: a.json().required(),
      language: a.string().required().default('en'),
      timezone: a.string().required().default('UTC'),
      user: a.belongsTo('User', 'userId'),
    })
    .authorization((allow) => [allow.owner('userId')])
    .secondaryIndexes((index) => [index('userId').name('byUser')]),

  // Dashboard Metrics model
  DashboardMetrics: a
    .model({
      userId: a.string().required(),
      tenantId: a.string().required(),
      metricDate: a.date().required(),
      totalUsers: a.integer().required(),
      activeUsers: a.integer().required(),
      subscriptionRevenue: a.integer().required(),
      conversionRate: a.float().required(),
      churnRate: a.float().required(),
      user: a.belongsTo('User', 'userId'),
    })
    .authorization((allow) => [allow.owner('userId')])
    .secondaryIndexes((index) => [
      index('userId').name('byUser'),
      index('userId', 'metricDate').name('byUserDate'),
    ]),

  // Custom mutations for Stripe integration
  createCheckoutSession: a
    .mutation()
    .arguments({
      priceId: a.string().required(),
      successUrl: a.string().required(),
      cancelUrl: a.string().required(),
    })
    .returns(
      a.customType({
        sessionId: a.string().required(),
        url: a.string().required(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('stripeCheckout')),

  // Custom mutations for OAuth account linking
  linkGoogleAccount: a
    .mutation()
    .arguments({
      googleToken: a.string().required(),
      googleId: a.string().required(),
    })
    .returns(a.ref('User'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('oauthLinking')),

  unlinkGoogleAccount: a
    .mutation()
    .returns(a.ref('User'))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function('oauthLinking')),

  // Stripe webhook handler
  handleStripeWebhook: a
    .mutation()
    .arguments({
      payload: a.string().required(),
      signature: a.string().required(),
    })
    .returns(
      a.customType({
        success: a.boolean().required(),
        message: a.string(),
      })
    )
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function('stripeWebhook')),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})