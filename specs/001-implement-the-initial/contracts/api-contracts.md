# API Contracts

## GraphQL Queries

### User Management

#### `getUser`
```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    email
    name
    avatar
    tenantId
    authProvider
    googleId
    emailVerified
    subscription {
      id
      status
      currentPeriodEnd
      stripePriceId
    }
    settings {
      theme
      language
      notifications
    }
    createdAt
    updatedAt
  }
}
```

**Purpose**: Retrieve user profile with subscription and settings
**Auth**: Owner only (authenticated user)
**Response**: User object with nested relationships

#### `getUsersByTenant`
```graphql
query GetUsersByTenant($tenantId: String!) {
  getUsersByTenant(tenantId: $tenantId) {
    items {
      id
      email
      name
      createdAt
    }
    nextToken
  }
}
```

**Purpose**: List all users in a tenant (admin function)
**Auth**: Private (authenticated users)
**Response**: Paginated list of users

### Subscription Management

#### `getSubscriptionByUser`
```graphql
query GetSubscriptionByUser($userId: String!) {
  getSubscriptionByUser(userId: $userId) {
    items {
      id
      stripeSubscriptionId
      stripePriceId
      status
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      createdAt
    }
  }
}
```

**Purpose**: Get subscription details for a user
**Auth**: Owner only
**Response**: Subscription object with Stripe details

#### `getActivePlans`
```graphql
query GetActivePlans {
  getActivePlans(active: true) {
    items {
      id
      name
      description
      stripePriceId
      price
      currency
      interval
      features
      maxUsers
      maxProjects
      priority
    }
  }
}
```

**Purpose**: List available subscription plans for pricing page
**Auth**: Public (no authentication required)
**Response**: List of active plans sorted by priority

### Dashboard Data

#### `getMetricsByUserDate`
```graphql
query GetMetricsByUserDate(
  $userId: String!,
  $metricDate: ModelStringKeyConditionInput
) {
  getMetricsByUserDate(userId: $userId, metricDate: $metricDate) {
    items {
      id
      metricDate
      totalUsers
      activeUsers
      subscriptionRevenue
      conversionRate
      churnRate
      createdAt
    }
    nextToken
  }
}
```

**Purpose**: Retrieve dashboard metrics for date range
**Auth**: Owner only
**Response**: Time-series metrics data

## GraphQL Mutations

### User Operations

#### `createUser`
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    name
    tenantId
    createdAt
  }
}
```

**Purpose**: Create new user account
**Auth**: Private (during registration flow)
**Input**: User details with auto-generated tenantId

#### `updateUser`
```graphql
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    avatar
    updatedAt
  }
}
```

**Purpose**: Update user profile information
**Auth**: Owner only
**Input**: User fields to update

### Subscription Operations

#### `createCheckoutSession`
```graphql
mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
  createCheckoutSession(input: $input) {
    sessionId
    url
  }
}
```

**Purpose**: Create Stripe checkout session for subscription
**Auth**: Private (authenticated users)
**Input**: Price ID and redirect URLs
**Response**: Stripe session details

#### `updateSubscription`
```graphql
mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
  updateSubscription(input: $input) {
    id
    status
    stripePriceId
    cancelAtPeriodEnd
    updatedAt
  }
}
```

**Purpose**: Modify existing subscription (upgrade/downgrade/cancel)
**Auth**: Owner only
**Input**: Subscription changes
**Response**: Updated subscription

#### `handleStripeWebhook`
```graphql
mutation HandleStripeWebhook($input: StripeWebhookInput!) {
  handleStripeWebhook(input: $input) {
    success
    message
  }
}
```

**Purpose**: Process Stripe webhook events
**Auth**: Public (Stripe webhook endpoint)
**Input**: Webhook payload and signature
**Response**: Processing status

### Settings Management

#### `createUserSettings`
```graphql
mutation CreateUserSettings($input: CreateUserSettingsInput!) {
  createUserSettings(input: $input) {
    id
    theme
    language
    timezone
    notifications
    createdAt
  }
}
```

**Purpose**: Initialize user settings (auto-created)
**Auth**: Owner only
**Input**: Default settings values

#### `updateUserSettings`
```graphql
mutation UpdateUserSettings($input: UpdateUserSettingsInput!) {
  updateUserSettings(input: $input) {
    id
    theme
    language
    timezone
    notifications
    updatedAt
  }
}
```

**Purpose**: Update user preferences
**Auth**: Owner only
**Input**: Settings to modify

### OAuth Account Management

#### `linkGoogleAccount`
```graphql
mutation LinkGoogleAccount($input: LinkGoogleAccountInput!) {
  linkGoogleAccount(input: $input) {
    id
    email
    authProvider
    googleId
    emailVerified
    updatedAt
  }
}
```

**Purpose**: Link Google account to existing email/password account
**Auth**: Owner only
**Input**: Google token and ID for verification
**Response**: Updated user with linked accounts

#### `unlinkGoogleAccount`
```graphql
mutation UnlinkGoogleAccount {
  unlinkGoogleAccount {
    id
    email
    authProvider
    googleId
    updatedAt
  }
}
```

**Purpose**: Remove Google account linking, revert to email/password only
**Auth**: Owner only
**Response**: Updated user without Google linking

## GraphQL Subscriptions

### Real-time Updates

#### `onSubscriptionUpdated`
```graphql
subscription OnSubscriptionUpdated($userId: String!) {
  onSubscriptionUpdated(userId: $userId) {
    id
    status
    stripePriceId
    currentPeriodEnd
    cancelAtPeriodEnd
    updatedAt
  }
}
```

**Purpose**: Real-time subscription status updates
**Auth**: Owner only
**Use Case**: Update UI when subscription changes

#### `onMetricsUpdated`
```graphql
subscription OnMetricsUpdated($userId: String!) {
  onMetricsUpdated(userId: $userId) {
    id
    metricDate
    totalUsers
    activeUsers
    subscriptionRevenue
    conversionRate
    churnRate
    updatedAt
  }
}
```

**Purpose**: Real-time dashboard metrics updates
**Auth**: Owner only
**Use Case**: Live dashboard updates

## REST API Endpoints

### Stripe Integration

#### `POST /api/stripe/webhook`
**Purpose**: Handle Stripe webhook events
**Auth**: Stripe signature validation
**Body**: Raw webhook payload
**Response**: 200 OK or error status

#### `POST /api/stripe/create-portal-session`
**Purpose**: Create Stripe customer portal session
**Auth**: Authenticated user
**Body**: `{ customerId: string, returnUrl: string }`
**Response**: `{ url: string }`

#### `GET /api/stripe/plans`
**Purpose**: Fetch Stripe prices for display
**Auth**: Public
**Response**: Array of plan objects with Stripe data

## Error Handling

### GraphQL Errors
```typescript
type GraphQLError = {
  message: string
  locations?: Array<{ line: number; column: number }>
  path?: Array<string | number>
  extensions?: {
    code: string
    details?: any
  }
}
```

### Common Error Codes
- `UNAUTHENTICATED`: User not logged in
- `UNAUTHORIZED`: User lacks permission
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource doesn't exist
- `STRIPE_ERROR`: Payment processing error
- `TENANT_MISMATCH`: Cross-tenant access attempt

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

## Rate Limiting

### GraphQL Operations
- Queries: 100 requests/minute per user
- Mutations: 50 requests/minute per user
- Subscriptions: 10 concurrent per user

### REST Endpoints
- Webhook: No limit (from Stripe)
- Portal session: 5 requests/minute per user
- Public endpoints: 1000 requests/hour per IP

## Caching Strategy

### Query Caching
- Plans: 1 hour TTL (infrequently updated)
- User profile: 5 minutes TTL
- Metrics: 15 minutes TTL
- Settings: No cache (user-specific)

### CDN Caching
- Static assets: 1 year
- API responses: No cache (dynamic content)
- Public queries: 5 minutes TTL