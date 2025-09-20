# Tasks: Initial SaaS Structure with Google Login

**Input**: Design documents from `/home/formiga/wo/github/videosaas/specs/001-implement-the-initial/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: Next.js App Router structure with `src/app/`, `src/components/`, `src/lib/`
- **Amplify**: `amplify/` directory for backend configuration
- **Tests**: `tests/` at repository root with contract, integration, and unit subdirectories

## Phase 3.1: Setup
- [x] T001 Create Next.js 14 project structure with App Router and TypeScript strict mode
- [x] T002 Initialize package.json with Amplify Gen 2, ShadCN/ui, Stripe SDK, and testing dependencies
- [x] T003 [P] Configure ESLint, Prettier, and TypeScript config files
- [x] T004 [P] Set up Tailwind CSS configuration with ShadCN/ui integration
- [x] T005 Initialize Amplify Gen 2 project structure in amplify/ directory
- [x] T006 [P] Create environment configuration templates (.env.example)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### GraphQL Contract Tests
- [x] T007 [P] Contract test for User queries (getUser, getUsersByTenant) in tests/contract/user-queries.test.ts
- [x] T008 [P] Contract test for User mutations (createUser, updateUser) in tests/contract/user-mutations.test.ts
- [ ] T009 [P] Contract test for Subscription queries in tests/contract/subscription-queries.test.ts
- [ ] T010 [P] Contract test for Subscription mutations in tests/contract/subscription-mutations.test.ts
- [ ] T011 [P] Contract test for SubscriptionPlan queries in tests/contract/plan-queries.test.ts
- [ ] T012 [P] Contract test for UserSettings mutations in tests/contract/settings-mutations.test.ts
- [ ] T013 [P] Contract test for OAuth mutations (linkGoogleAccount, unlinkGoogleAccount) in tests/contract/oauth-mutations.test.ts

### Stripe Integration Contract Tests
- [x] T014 [P] Contract test for createCheckoutSession mutation in tests/contract/stripe-checkout.test.ts
- [ ] T015 [P] Contract test for Stripe webhook handler in tests/contract/stripe-webhook.test.ts

### Integration Tests
- [x] T016 [P] Landing page integration test in tests/integration/landing-page.test.ts
- [x] T017 [P] Email/password registration flow in tests/integration/email-auth.test.ts
- [x] T018 [P] Google OAuth registration flow in tests/integration/google-auth.test.ts
- [ ] T019 [P] Account linking flow in tests/integration/account-linking.test.ts
- [ ] T020 [P] Subscription purchase flow in tests/integration/subscription-flow.test.ts
- [ ] T021 [P] Admin dashboard access test in tests/integration/admin-access.test.ts
- [ ] T022 [P] Profile management test in tests/integration/profile-management.test.ts
- [ ] T023 [P] Settings configuration test in tests/integration/settings-management.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Backend - Amplify Schema & Resolvers
- [x] T024 Implement Amplify GraphQL schema in amplify/data/resource.ts
- [ ] T025 [P] Create User custom resolvers for OAuth integration in amplify/functions/user-resolvers/
- [ ] T026 [P] Create Stripe checkout session Lambda in amplify/functions/stripe-checkout/
- [ ] T027 [P] Create Stripe webhook handler Lambda in amplify/functions/stripe-webhook/
- [ ] T028 [P] Create Google account linking Lambda in amplify/functions/oauth-linking/

### Authentication Configuration
- [x] T029 Configure Amplify Auth with Google OAuth provider in amplify/auth/resource.ts
- [ ] T030 Set up Cognito User Pool with Google identity provider configuration

### Frontend - Core Components (ShadCN/ui)
- [x] T031 [P] Create base UI components using ShadCN in src/components/ui/
- [ ] T032 [P] Create AuthProvider context for authentication state in src/lib/auth-context.tsx
- [ ] T033 [P] Create Stripe payment provider in src/lib/stripe-context.tsx

### Landing Page Components
- [ ] T034 [P] Hero section component in src/components/landing/hero-section.tsx
- [ ] T035 [P] Features section component in src/components/landing/features-section.tsx
- [ ] T036 [P] Pricing section component in src/components/landing/pricing-section.tsx
- [ ] T037 [P] Pricing card component in src/components/landing/pricing-card.tsx

### Authentication Components
- [ ] T038 [P] Login form component with dual auth in src/components/auth/login-form.tsx
- [ ] T039 [P] Signup form component with dual auth in src/components/auth/signup-form.tsx
- [ ] T040 [P] Google OAuth button component in src/components/auth/google-oauth-button.tsx
- [ ] T041 [P] Email verification component in src/components/auth/email-verification.tsx

### Admin Area Components
- [ ] T042 [P] Dashboard layout component in src/components/dashboard/dashboard-layout.tsx
- [ ] T043 [P] Profile management form in src/components/dashboard/profile-form.tsx
- [ ] T044 [P] Dashboard metrics display in src/components/dashboard/metrics-dashboard.tsx
- [ ] T045 [P] Settings configuration form in src/components/dashboard/settings-form.tsx
- [ ] T046 [P] Subscription management component in src/components/dashboard/subscription-management.tsx

### Page Components (App Router)
- [x] T047 Landing page implementation in src/app/page.tsx
- [x] T048 Login page implementation in src/app/login/page.tsx
- [x] T049 Signup page implementation in src/app/signup/page.tsx
- [x] T050 Dashboard page implementation in src/app/dashboard/page.tsx
- [x] T051 Profile page implementation in src/app/dashboard/profile/page.tsx
- [x] T052 Settings page implementation in src/app/dashboard/settings/page.tsx

### API Routes & Utilities
- [ ] T053 [P] Stripe webhook API route in src/app/api/stripe/webhook/route.ts
- [ ] T054 [P] Authentication utilities in src/lib/auth-utils.ts
- [ ] T055 [P] Stripe utilities and helpers in src/lib/stripe-utils.ts
- [ ] T056 [P] GraphQL client configuration in src/lib/graphql-client.ts
- [ ] T057 [P] Multi-tenancy utilities in src/lib/tenant-utils.ts

## Phase 3.4: Integration
- [ ] T058 Connect authentication components to Amplify Auth
- [ ] T059 Connect subscription components to Stripe API
- [ ] T060 Implement protected route middleware for admin area
- [ ] T061 Set up OAuth callback handling and account linking logic
- [ ] T062 Configure CORS and security headers for API routes
- [ ] T063 Implement error boundary components for graceful error handling
- [ ] T064 Set up logging and monitoring for authentication flows

## Phase 3.5: Polish
- [ ] T065 [P] Unit tests for authentication utilities in tests/unit/auth-utils.test.ts
- [ ] T066 [P] Unit tests for Stripe utilities in tests/unit/stripe-utils.test.ts
- [ ] T067 [P] Unit tests for multi-tenancy utilities in tests/unit/tenant-utils.test.ts
- [ ] T068 [P] Unit tests for form validation in tests/unit/form-validation.test.ts
- [ ] T069 Performance optimization - implement Next.js Image optimization
- [ ] T070 Performance optimization - implement route-based code splitting
- [ ] T071 Accessibility audit and improvements (WCAG 2.1 AA compliance)
- [ ] T072 [P] Update README.md with setup and deployment instructions
- [ ] T073 Core Web Vitals optimization (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] T074 Run complete quickstart validation per quickstart.md

## Dependencies
- Setup (T001-T006) before everything else
- Tests (T007-T023) before implementation (T024-T057)
- T024 (Amplify schema) blocks all backend tasks (T025-T028)
- T029-T030 (Auth configuration) blocks auth components (T038-T041)
- T031-T033 (Base components/contexts) block all other components
- T047-T052 (Pages) require their respective components to be complete
- Integration (T058-T064) requires all core implementation
- Polish (T065-T074) requires all previous phases

## Parallel Execution Examples

### Phase 3.2 - Contract Tests (can all run in parallel)
```bash
# Launch T007-T015 together (GraphQL + Stripe contract tests):
Task: "Contract test for User queries in tests/contract/user-queries.test.ts"
Task: "Contract test for User mutations in tests/contract/user-mutations.test.ts"
Task: "Contract test for Subscription queries in tests/contract/subscription-queries.test.ts"
Task: "Contract test for createCheckoutSession mutation in tests/contract/stripe-checkout.test.ts"
# ... (all contract tests can run simultaneously)
```

### Phase 3.2 - Integration Tests (can all run in parallel)
```bash
# Launch T016-T023 together (integration tests):
Task: "Landing page integration test in tests/integration/landing-page.test.ts"
Task: "Email/password registration flow in tests/integration/email-auth.test.ts"
Task: "Google OAuth registration flow in tests/integration/google-auth.test.ts"
Task: "Account linking flow in tests/integration/account-linking.test.ts"
# ... (all integration tests can run simultaneously)
```

### Phase 3.3 - Component Development (after base setup)
```bash
# Launch T034-T037 together (landing page components):
Task: "Hero section component in src/components/landing/hero-section.tsx"
Task: "Features section component in src/components/landing/features-section.tsx"
Task: "Pricing section component in src/components/landing/pricing-section.tsx"
Task: "Pricing card component in src/components/landing/pricing-card.tsx"
```

### Phase 3.3 - Utility Development
```bash
# Launch T054-T057 together (utility functions):
Task: "Authentication utilities in src/lib/auth-utils.ts"
Task: "Stripe utilities and helpers in src/lib/stripe-utils.ts"
Task: "GraphQL client configuration in src/lib/graphql-client.ts"
Task: "Multi-tenancy utilities in src/lib/tenant-utils.ts"
```

## Notes
- [P] tasks = different files, no dependencies between them
- Always verify tests fail before implementing functionality (TDD approach)
- Commit after each completed task for clear development history
- Landing page should be accessible without authentication
- Admin area requires authentication and proper access control
- Google OAuth integration must go through Amplify Auth (Cognito) only
- All components must use ShadCN/ui for consistent styling
- Multi-tenancy must be enforced at all data access points

## Task Generation Rules Applied

1. **From Contracts**:
   - amplify-schema.graphql → 7 contract test tasks (T007-T013)
   - api-contracts.md → Stripe integration tests (T014-T015)

2. **From Data Model**:
   - User entity → T008, T025, T054, T057
   - Subscription entity → T009, T010, T046
   - SubscriptionPlan entity → T011, T036, T037
   - UserSettings entity → T012, T045

3. **From User Stories** (via quickstart.md):
   - Landing page experience → T016, T034-T037, T047
   - Registration flows → T017, T018, T038-T041, T048, T049
   - Account linking → T019, T028
   - Subscription workflow → T020, T026, T027, T053, T055
   - Admin area access → T021-T023, T042-T046, T050-T052

## Validation Checklist ✓

- [x] All contracts have corresponding tests (T007-T015)
- [x] All entities have model/implementation tasks
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD approach enforced (tests must fail before implementation)
- [x] Constitutional compliance maintained (Amplify Gen 2 + Next.js + ShadCN only)