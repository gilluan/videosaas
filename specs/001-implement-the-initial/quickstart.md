# Quickstart Guide: Initial SaaS Structure

## Overview
This quickstart validates the complete user journey from landing page to subscription management. Follow these steps to verify the implementation meets all functional requirements.

## Prerequisites
- Node.js 18+ installed
- AWS CLI configured with appropriate permissions
- Stripe account with test keys
- Git repository cloned and on the `001-implement-the-initial` branch

## Setup Instructions

### 1. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Configure required environment variables
NEXT_PUBLIC_AMPLIFY_APP_ID=your_amplify_app_id
NEXT_PUBLIC_AMPLIFY_BRANCH=main
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Amplify Setup
```bash
# Initialize Amplify Gen 2
npx amplify configure
npx amplify init

# Deploy backend schema
npx amplify push
```

### 4. Google OAuth Configuration
```bash
# Google Cloud Console setup:
# 1. Create project at https://console.cloud.google.com/
# 2. Enable Google+ API
# 3. Create OAuth 2.0 Client ID
# 4. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/callback/google (development)
#    - https://your-domain.com/api/auth/callback/google (production)
# 5. Copy Client ID and Client Secret to environment variables
```

### 5. Stripe Configuration
```bash
# Create test products and prices in Stripe Dashboard
# Note the price IDs for your .env configuration

# Set up webhook endpoint (after deployment)
# Webhook URL: https://your-domain.com/api/stripe/webhook
# Events: customer.subscription.created, customer.subscription.updated, customer.subscription.deleted
```

### 6. Run Development Server
```bash
npm run dev
```

## User Journey Validation

### Test Case 1: Landing Page Experience
**Objective**: Verify landing page displays correctly with pricing and signup

1. **Navigate to landing page**
   ```
   URL: http://localhost:3000
   ```

2. **Verify page elements**
   - [ ] Hero section with clear value proposition
   - [ ] Features section highlighting product benefits
   - [ ] Pricing section with 3 distinct plans
   - [ ] Clear "Sign Up" or "Get Started" buttons
   - [ ] Responsive design on mobile/tablet

3. **Test pricing section**
   - [ ] All 3 subscription plans displayed
   - [ ] Features clearly differentiated
   - [ ] Pricing shown in correct currency
   - [ ] Call-to-action buttons functional

**Expected Result**: Landing page loads in <2 seconds, displays all elements correctly

### Test Case 2: User Registration & Authentication
**Objective**: Complete signup flow with custom-styled forms supporting both email and Google OAuth

1. **Start registration process**
   - Click "Sign Up" button on landing page
   - [ ] Redirected to styled signup form
   - [ ] Both email/password and Google login options visible

2. **Test email/password registration**
   ```
   Test user data:
   Email: test@example.com
   Password: TestPassword123!
   Name: Test User
   ```
   - [ ] Form validation works correctly
   - [ ] Error messages display properly
   - [ ] Success state shown on completion

3. **Test Google OAuth registration**
   - Click "Sign up with Google" button
   - [ ] Redirected to Google OAuth consent screen
   - [ ] Authorization successful
   - [ ] Account created with Google profile data
   - [ ] User marked as email verified

4. **Verify email confirmation (email/password only)**
   - [ ] Confirmation email received
   - [ ] Email link verification works
   - [ ] Account activated successfully

5. **Test login process**
   - Navigate to login page
   - Test both authentication methods:
     - Email/password login
     - Google OAuth login
   - [ ] Custom ShadCN styling applied
   - [ ] Authentication successful for both methods
   - [ ] Redirected to dashboard

6. **Test account linking**
   - Create account with email/password
   - Log in and link Google account with same email
   - [ ] Account linking successful
   - [ ] AuthProvider updated to "LINKED"

**Expected Result**: Registration flow completes without errors for both authentication methods, login works with styled forms

### Test Case 3: Subscription Workflow
**Objective**: Complete payment flow with Stripe embedded checkout

1. **Select subscription plan**
   - From landing page or after registration
   - Click on one of the 3 pricing plans
   - [ ] Redirected to Stripe checkout

2. **Complete payment**
   ```
   Test card: 4242 4242 4242 4242
   Expiry: Any future date
   CVC: Any 3 digits
   ```
   - [ ] Embedded checkout form loads
   - [ ] Payment processing successful
   - [ ] Webhook received and processed
   - [ ] Subscription created in database

3. **Verify subscription status**
   - [ ] User subscription status updated
   - [ ] Access granted to admin area
   - [ ] Correct plan features available

**Expected Result**: Payment completes successfully, subscription activated

### Test Case 4: Admin Area Access
**Objective**: Verify authenticated users can access all admin sections

1. **Access dashboard**
   ```
   URL: http://localhost:3000/dashboard
   ```
   - [ ] Authentication required
   - [ ] Dashboard loads with user data
   - [ ] Metrics displayed correctly
   - [ ] Navigation menu visible

2. **Test user profile section**
   ```
   URL: http://localhost:3000/dashboard/profile
   ```
   - [ ] Current user information displayed
   - [ ] Edit functionality works
   - [ ] Avatar upload/change works
   - [ ] Form validation active

3. **Test settings section**
   ```
   URL: http://localhost:3000/dashboard/settings
   ```
   - [ ] Theme selection works (light/dark/system)
   - [ ] Language preferences saved
   - [ ] Notification settings configurable
   - [ ] Changes persist after page refresh

4. **Test subscription management**
   ```
   URL: http://localhost:3000/dashboard/billing
   ```
   - [ ] Current subscription displayed
   - [ ] Plan upgrade/downgrade options
   - [ ] Cancellation functionality
   - [ ] Billing history shown

**Expected Result**: All admin sections accessible and functional

### Test Case 5: Authentication Edge Cases
**Objective**: Verify security and access control

1. **Test unauthenticated access**
   - Try accessing `/dashboard` without login
   - [ ] Redirected to login page
   - [ ] Cannot access protected routes
   - [ ] Session persistence works

2. **Test logout functionality**
   - Click logout button
   - [ ] Session cleared
   - [ ] Redirected to landing page
   - [ ] Cannot access protected routes

**Expected Result**: Proper authentication flow and access control

## Performance Validation

### Page Load Performance
```bash
# Run Lighthouse audit
npm run audit

# Check Core Web Vitals
# Target metrics:
# - LCP (Largest Contentful Paint): < 2.5s
# - FID (First Input Delay): < 100ms
# - CLS (Cumulative Layout Shift): < 0.1
```

### Load Testing
```bash
# Install k6 for load testing
npm install -g k6

# Run basic load test
k6 run load-test.js

# Target performance:
# - Landing page: 100 concurrent users
# - API endpoints: 50 requests/second
# - Error rate: < 1%
```

## Database Validation

### Data Integrity
1. **Verify user data**
   ```bash
   # Check user creation
   aws dynamodb scan --table-name User-dev --region us-east-1
   ```

2. **Verify subscription data**
   ```bash
   # Check subscription records
   aws dynamodb scan --table-name Subscription-dev --region us-east-1
   ```

3. **Verify multi-tenancy**
   - [ ] TenantId present in all records
   - [ ] Cross-tenant access blocked
   - [ ] Data isolation enforced

### Webhook Testing
```bash
# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test events
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
```

## Integration Testing

### API Contract Testing
```bash
# Run contract tests
npm run test:contracts

# Verify GraphQL schema
npm run test:graphql
```

### End-to-End Testing
```bash
# Run Playwright E2E tests
npm run test:e2e

# Test scenarios:
# - Complete user registration
# - Subscription purchase flow
# - Admin area navigation
# - Settings management
```

## Success Criteria

### Functional Requirements Met
- [ ] FR-001: Modern landing page displays correctly
- [ ] FR-002: Signup button functional and prominent
- [ ] FR-003: Three subscription plans clearly presented
- [ ] FR-004: Stripe payment integration working
- [ ] FR-005: Custom-styled authentication forms
- [ ] FR-006: Admin area with all three sections
- [ ] FR-007: User profile management functional
- [ ] FR-008: Dashboard with relevant metrics
- [ ] FR-009: Settings configuration working
- [ ] FR-010: Complete subscription workflow
- [ ] FR-011: Proper access control enforced
- [ ] FR-012: Consistent UI/UX across application

### Performance Requirements Met
- [ ] Landing page loads in < 2 seconds
- [ ] Core Web Vitals within targets
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility standards met (WCAG 2.1 AA)

### Security Requirements Met
- [ ] Authentication required for protected routes
- [ ] Multi-tenant data isolation verified
- [ ] Input validation functional
- [ ] Secure environment variable handling
- [ ] Stripe webhook signature validation

## Troubleshooting

### Common Issues

**Amplify deployment fails**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Verify Amplify CLI version
npm install -g @aws-amplify/cli@latest
```

**Stripe webhook not receiving events**
```bash
# Check webhook endpoint URL
# Verify webhook secret in environment
# Test with Stripe CLI: stripe listen
```

**Database connection issues**
```bash
# Verify Amplify GraphQL endpoint
# Check IAM permissions
# Review CloudWatch logs
```

**Performance issues**
```bash
# Check bundle size: npm run analyze
# Verify image optimization
# Review database query patterns
```

## Next Steps

After successful quickstart validation:

1. **Production Deployment**
   - Configure production Amplify app
   - Set up production Stripe account
   - Configure custom domain
   - Set up monitoring and alerts

2. **Additional Features**
   - Implement usage analytics
   - Add email notifications
   - Set up customer support integration
   - Create admin management tools

3. **Optimization**
   - Implement caching strategies
   - Optimize database queries
   - Add progressive web app features
   - Enhance SEO optimization

## Support

For issues during quickstart:
1. Check error logs in browser console
2. Review Amplify CloudWatch logs
3. Verify Stripe dashboard for payment events
4. Consult documentation in `/docs` folder