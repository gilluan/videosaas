# VideoSaaS Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-20

## Active Technologies
- Next.js 14+ with App Router + TypeScript (001-implement-the-initial)
- AWS Amplify Gen 2 with GraphQL + DynamoDB (001-implement-the-initial)
- ShadCN/ui + Tailwind CSS (001-implement-the-initial)
- Stripe SDK for payments (001-implement-the-initial)
- Google OAuth via Amplify Auth (Cognito) (001-implement-the-initial)

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # ShadCN UI components
│   ├── ui/                # Base ShadCN components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Admin area components
│   └── landing/           # Landing page components
├── lib/                   # Utility functions
│   ├── amplify.ts         # Amplify configuration
│   ├── stripe.ts          # Stripe helpers
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions

tests/
├── components/            # Component unit tests
├── integration/           # API integration tests
└── e2e/                  # Playwright E2E tests
```

## Constitutional Requirements
- **Minimal Dependencies**: Only use Next.js, Amplify Gen 2, ShadCN, Stripe
- **SaaS-First**: Multi-tenancy with tenant ID in all data models
- **Component-Based**: ShadCN atomic design (atoms → molecules → organisms)
- **API-First**: GraphQL schema defined before implementation
- **Performance**: <2s page loads, Core Web Vitals compliance

## Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests
npm run lint            # ESLint check
npm run typecheck       # TypeScript validation

# Amplify
npx amplify push        # Deploy backend changes
npx amplify pull        # Sync backend updates
npx amplify codegen     # Generate GraphQL types

# Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Code Style
- TypeScript strict mode enabled with 100% type coverage
- ESLint + Prettier for consistent formatting
- Component props interfaces required
- GraphQL operations with generated types
- Multi-tenant patterns with tenantId validation

## Development Patterns

### Component Structure
```typescript
// ShadCN atomic design pattern
// atoms/Button.tsx
import { Button } from "@/components/ui/button"

// molecules/PricingCard.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// organisms/PricingSection.tsx
import { PricingCard } from "@/components/molecules/PricingCard"
```

### GraphQL Operations
```typescript
// Auto-generated types from schema
import { graphql } from '@/gql'
import { generateClient } from 'aws-amplify/api'

const client = generateClient()

// Type-safe queries
const getUserQuery = graphql(`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id name email subscription { status }
    }
  }
`)
```

### Multi-tenancy Pattern
```typescript
// All operations require tenantId
const createUser = async (userData: CreateUserInput) => {
  const tenantId = generateTenantId() // UUID v4
  return await client.graphql({
    query: createUserMutation,
    variables: { input: { ...userData, tenantId } }
  })
}
```

### Google OAuth Pattern
```typescript
// Amplify Auth configuration with Google provider
import { Amplify } from 'aws-amplify'
import { signInWithRedirect, signUp } from 'aws-amplify/auth'

// Sign in with Google
const signInWithGoogle = async () => {
  await signInWithRedirect({ provider: 'Google' })
}

// Handle OAuth callback and user creation
const handleOAuthUser = async (user: AuthUser) => {
  const { email, name, picture } = user.attributes
  const googleId = user.username // Cognito maps Google ID to username

  const userData = {
    email,
    name: name || email.split('@')[0],
    avatar: picture,
    authProvider: 'GOOGLE',
    googleId,
    emailVerified: true,
    tenantId: generateTenantId()
  }

  return await createUser(userData)
}
```

## Recent Changes
- 001-implement-the-initial: Added initial SaaS structure with landing page, subscription plans, Stripe integration, admin area, and Google OAuth authentication

<!-- MANUAL ADDITIONS START -->
<!-- Add any project-specific notes or overrides here -->
<!-- MANUAL ADDITIONS END -->