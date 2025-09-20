# VideoSaaS - Modern Video Platform

A complete SaaS application built with Next.js 14, AWS Amplify Gen 2, and Stripe integration.

## Features

- **Modern Landing Page**: Conversion-optimized landing page with hero section, features, and pricing
- **Dual Authentication**: Email/password and Google OAuth authentication via AWS Cognito
- **Three-Tier Subscription Plans**: Starter ($29), Professional ($79), and Enterprise ($199)
- **Admin Dashboard**: Complete admin area with profile management, settings, and subscription management
- **Multi-Tenant Architecture**: Secure tenant isolation for SaaS operations
- **Stripe Integration**: End-to-end payment processing and subscription management

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Components**: ShadCN/ui for consistent design system
- **Backend**: AWS Amplify Gen 2 with GraphQL API
- **Database**: DynamoDB (managed by Amplify)
- **Authentication**: AWS Cognito with Google OAuth
- **Payments**: Stripe for subscription billing
- **Testing**: Vitest with Playwright for E2E testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI configured
- Stripe account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd videosaas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your actual values:
   - Stripe keys and price IDs
   - AWS Amplify configuration
   - Google OAuth credentials

4. **Deploy Amplify backend**
   ```bash
   npx ampx sandbox
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Admin dashboard pages
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # React components
│   ├── ui/               # ShadCN/ui base components
│   ├── landing/          # Landing page components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
└── lib/                  # Utilities and configurations
    ├── auth-context.tsx  # Authentication context
    ├── auth-utils.ts     # Authentication utilities
    ├── stripe-context.tsx # Stripe payment context
    ├── stripe-utils.ts   # Stripe utilities
    ├── graphql-client.ts # GraphQL client configuration
    └── tenant-utils.ts   # Multi-tenancy utilities

amplify/
├── auth/                 # Amplify Auth configuration
├── data/                 # GraphQL schema and resolvers
└── functions/            # Lambda functions

tests/
├── contract/             # Contract tests for API
├── integration/          # Integration tests
└── unit/                # Unit tests
```

## Authentication Flow

1. **Email/Password Registration**:
   - User signs up with email and password
   - Email verification required
   - User record created in DynamoDB

2. **Google OAuth**:
   - One-click Google sign-in
   - Account linking for existing users
   - Automatic user creation for new users

3. **Account Management**:
   - Profile updates
   - Password changes
   - Account linking/unlinking

## Subscription Management

1. **Three-Tier Plans**:
   - **Starter** ($29/month): Basic features
   - **Professional** ($79/month): Advanced features + team collaboration
   - **Enterprise** ($199/month): Full feature set + enterprise support

2. **Stripe Integration**:
   - Secure checkout sessions
   - Webhook handling for subscription events
   - Customer portal for billing management

## Security Features

- **Multi-Tenant Isolation**: All data access is tenant-scoped
- **Authentication Required**: Protected routes and API endpoints
- **Secure Payments**: PCI-compliant Stripe integration
- **Environment Variables**: Sensitive data in environment variables

## Deployment

### Amplify Hosting

1. Connect repository to Amplify Console
2. Configure build settings
3. Set environment variables
4. Deploy backend and frontend together

### Manual Deployment

1. Deploy Amplify backend:
   ```bash
   npx ampx deploy --branch main
   ```

2. Build and deploy frontend:
   ```bash
   npm run build
   # Deploy to your preferred hosting platform
   ```

## Environment Variables

Required environment variables (see `.env.example`):

- `NEXT_PUBLIC_APP_URL`: Application URL
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `STRIPE_*_PRICE_ID`: Price IDs for each subscription plan

## Contributing

1. Follow existing code style and conventions
2. Write tests for new features
3. Update documentation for API changes
4. Follow constitutional compliance (minimal dependencies)

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

Built with ❤️ using Next.js, AWS Amplify, and Stripe.