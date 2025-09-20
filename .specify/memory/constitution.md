<!--
Sync Impact Report:
Version change: N/A → 1.0.0
Modified principles: New constitution - all principles created
Added sections: All sections new (Core Principles, Technology Stack, Development Standards, Governance)
Removed sections: None
Templates requiring updates:
  - ✅ .specify/templates/plan-template.md - references constitution checks
  - ✅ .specify/templates/spec-template.md - no constitution references found
  - ✅ .specify/templates/tasks-template.md - no constitution references found
Follow-up TODOs: None - all placeholders filled
-->

# VideoSaaS Constitution

## Core Principles

### I. Minimal Dependencies
Every feature MUST use the core tech stack: NextJS, Amplify Gen 2, ShadCN, and Stripe. Additional dependencies require explicit justification. No libraries that duplicate existing capabilities within our stack. Keep the dependency tree lean to reduce security surface area and maintenance overhead.

### II. SaaS-First Architecture
Every feature MUST be designed for multi-tenancy from day one. User isolation is non-negotiable through proper data segmentation. Subscription and billing integration using Stripe is mandatory for all user-facing features. Features must scale horizontally without architectural changes.

### III. Component-Based Development
UI components MUST be built using ShadCN design system with consistent theming. Components must be reusable across different pages and contexts. Each component should be independently testable and documented. Follow atomic design principles: atoms, molecules, organisms.

### IV. API-First Development
All business logic MUST be exposed through well-defined API endpoints using Amplify Gen 2 data layer. Frontend and backend development can proceed in parallel with API contracts. Use GraphQL for complex queries and mutations. REST endpoints only for simple CRUD operations.

### V. Performance & User Experience
Page load times MUST be under 2 seconds on 3G connections. Implement proper loading states and optimistic updates. Use Next.js Image optimization and lazy loading. Critical rendering path optimization is mandatory. Progressive enhancement over graceful degradation.

## Technology Stack

**Core Technologies**:
- Frontend: Next.js 14+ with App Router
- Backend: AWS Amplify Gen 2 (GraphQL, Lambda, DynamoDB)
- UI Components: ShadCN/ui with Tailwind CSS
- Payments: Stripe for subscriptions and billing
- Authentication: Amplify Auth with Cognito
- Hosting: Amplify Hosting with CDN

**Development Tools**:
- TypeScript for type safety
- ESLint and Prettier for code quality
- Vitest for unit testing
- Playwright for E2E testing

**Constraints**:
- No additional state management libraries (use React state + Amplify)
- No custom CSS frameworks (Tailwind + ShadCN only)
- No alternative payment processors (Stripe only)
- No third-party authentication providers (Amplify Auth only)

## Development Standards

**Code Quality**:
- TypeScript strict mode enabled
- 100% type coverage for new code
- ESLint errors are blocking for commits
- Components must have unit tests
- Critical user flows must have E2E tests

**Security Requirements**:
- All user inputs must be validated server-side
- API endpoints require authentication by default
- Sensitive data encrypted at rest and in transit
- Regular dependency vulnerability scanning
- No secrets in client-side code

**Performance Standards**:
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Bundle size limits: Initial JS < 200KB, Page-specific < 100KB
- Database queries optimized with proper indexing
- Image optimization mandatory for all assets

## Governance

**Amendment Process**:
Constitution changes require documentation of rationale and impact assessment. Breaking changes to core principles require migration plan for existing features. Version increment follows semantic versioning: MAJOR for principle changes, MINOR for new sections, PATCH for clarifications.

**Compliance Review**:
All pull requests must verify constitutional compliance. Features violating principles require explicit justification and temporary waiver approval. Regular architecture reviews ensure continued adherence to tech stack constraints.

**Development Workflow**:
Feature development follows TDD approach with API contracts first. Code reviews mandatory for all changes. Deployment requires passing all tests and performance benchmarks. Use CLAUDE.md for AI assistant context in development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-09-20 | **Last Amended**: 2025-09-20