# Data Model Design

## Core Entities

### User
```typescript
type User = {
  id: string              // UUID primary key
  email: string           // Unique, required for auth
  name: string           // Display name
  avatar?: string        // Profile image URL
  tenantId: string       // Multi-tenancy isolation
  subscriptionId?: string // Link to Stripe subscription
  authProvider: AuthProvider // How user authenticated
  googleId?: string      // Google user ID if using OAuth
  emailVerified: boolean // Email verification status
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}

enum AuthProvider {
  EMAIL = "email"
  GOOGLE = "google"
  LINKED = "linked"      // Both email and Google linked
}
```

**Validation Rules**:
- Email must be valid format and unique
- Name minimum 2 characters, maximum 100
- TenantId required for all operations
- SubscriptionId links to Stripe subscription object
- AuthProvider must be valid enum value
- GoogleId required when authProvider is GOOGLE or LINKED
- EmailVerified defaults to true for Google OAuth, false for email signup

**Relationships**:
- One-to-one with Subscription
- One-to-many with UserSettings

### Subscription
```typescript
type Subscription = {
  id: string                    // UUID primary key
  userId: string               // Foreign key to User
  tenantId: string             // Multi-tenancy isolation
  stripeSubscriptionId: string // Stripe subscription ID
  stripePriceId: string        // Stripe price ID for plan
  status: SubscriptionStatus   // active, canceled, past_due, etc.
  currentPeriodStart: AWSDateTime
  currentPeriodEnd: AWSDateTime
  cancelAtPeriodEnd: boolean
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}

enum SubscriptionStatus {
  ACTIVE = "active"
  CANCELED = "canceled"
  PAST_DUE = "past_due"
  INCOMPLETE = "incomplete"
  TRIALING = "trialing"
}
```

**Validation Rules**:
- StripeSubscriptionId must be valid Stripe subscription
- Status must be valid enum value
- Period dates must be logical (start < end)

**State Transitions**:
- incomplete → active (payment successful)
- active → past_due (payment failed)
- active → canceled (user cancellation)
- trialing → active (trial conversion)

### SubscriptionPlan
```typescript
type SubscriptionPlan = {
  id: string              // UUID primary key
  name: string           // Plan display name (Starter, Pro, Enterprise)
  description: string    // Plan description for marketing
  stripePriceId: string  // Stripe price ID
  price: number          // Price in cents
  currency: string       // Currency code (USD)
  interval: BillingInterval // monthly, yearly
  features: string[]     // List of feature descriptions
  maxUsers?: number      // User limit (null = unlimited)
  maxProjects?: number   // Project limit (null = unlimited)
  priority: number       // Display order (1 = first)
  active: boolean        // Available for new subscriptions
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}

enum BillingInterval {
  MONTHLY = "monthly"
  YEARLY = "yearly"
}
```

**Validation Rules**:
- Name and description required, max 200 characters
- Price must be positive integer (cents)
- Currency must be valid ISO code
- Features array max 10 items
- Priority must be unique per active plan

### UserSettings
```typescript
type UserSettings = {
  id: string              // UUID primary key
  userId: string         // Foreign key to User
  tenantId: string       // Multi-tenancy isolation
  theme: Theme           // light, dark, system
  notifications: NotificationSettings
  language: string       // ISO language code
  timezone: string       // IANA timezone
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}

enum Theme {
  LIGHT = "light"
  DARK = "dark"
  SYSTEM = "system"
}

type NotificationSettings = {
  email: boolean         // Email notifications enabled
  browser: boolean       // Browser push notifications
  marketing: boolean     // Marketing emails
  billing: boolean       // Billing notifications
}
```

**Validation Rules**:
- One settings record per user
- Language must be valid ISO 639-1 code
- Timezone must be valid IANA timezone
- Notification settings default to true except marketing

### DashboardMetrics
```typescript
type DashboardMetrics = {
  id: string              // UUID primary key
  userId: string         // Foreign key to User
  tenantId: string       // Multi-tenancy isolation
  metricDate: AWSDate    // Date for metrics (YYYY-MM-DD)
  totalUsers: number     // Total users in tenant
  activeUsers: number    // Active users (last 30 days)
  subscriptionRevenue: number // Revenue in cents
  conversionRate: number // Percentage as decimal
  churnRate: number      // Percentage as decimal
  createdAt: AWSDateTime
  updatedAt: AWSDateTime
}
```

**Validation Rules**:
- One record per user per date
- All numeric values must be non-negative
- Rates are decimals (0.05 = 5%)
- Revenue in cents for precision

## Database Indexes

### Primary Indexes
- User: id (primary key)
- Subscription: id (primary key)
- SubscriptionPlan: id (primary key)
- UserSettings: id (primary key)
- DashboardMetrics: id (primary key)

### Global Secondary Indexes (GSI)
- User-by-tenant: tenantId (partition key)
- User-by-email: email (partition key) - unique
- Subscription-by-user: userId (partition key)
- Subscription-by-tenant: tenantId (partition key)
- Settings-by-user: userId (partition key)
- Metrics-by-user-date: userId (partition key), metricDate (sort key)
- Active-plans: active (partition key), priority (sort key)

## Multi-tenancy Strategy

### Tenant Isolation
- All entities include `tenantId` field
- Row-level security enforced in GraphQL resolvers
- Tenant ID derived from authenticated user context
- No cross-tenant data access possible

### Tenant ID Generation
- UUID v4 format
- Generated during user registration
- Immutable after creation
- Used in all database operations

## Data Access Patterns

### User Registration Flow
1. Create User with generated tenantId
2. Create default UserSettings
3. Create Stripe customer
4. Link subscription if plan selected

### Subscription Management
1. User selects plan → Stripe checkout
2. Webhook creates/updates Subscription
3. Dashboard metrics updated
4. Access controls applied

### Dashboard Data Loading
1. Query user by auth token
2. Query subscription status
3. Query latest metrics
4. Query user settings for theme/preferences

## Performance Considerations

### Query Optimization
- Use GSI for tenant-scoped queries
- Batch queries where possible
- Implement pagination for large datasets
- Cache frequently accessed data

### Storage Efficiency
- Use consistent field naming
- Minimize nested object depth
- Compress large text fields
- Archive old metrics data

## Security Model

### Access Control
- Authentication required for all operations
- Authorization based on tenantId matching
- Admin operations require elevated permissions
- Audit log for sensitive operations

### Data Protection
- PII encrypted at rest
- Sensitive fields marked for encryption
- No sensitive data in logs
- GDPR compliance for data deletion