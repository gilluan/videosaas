import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../../amplify/data/resource'

// Helper function to get client safely
function getGraphQLClient() {
  // Don't try to create client during build process
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return null
  }
  return generateClient<Schema>()
}

// Legacy client export - deprecated, use graphqlOperations instead
export const client = {
  graphql: () => {
    throw new Error('Use graphqlOperations instead of direct client access')
  }
}

// Helper types for common operations
export type CreateUserInput = {
  email: string
  name: string
  avatar?: string
  tenantId: string
  authProvider: 'EMAIL' | 'GOOGLE' | 'LINKED'
  googleId?: string
  emailVerified: boolean
}

export type UpdateUserInput = {
  id?: string
  email?: string
  name?: string
  avatar?: string
  emailVerified?: boolean
}

export type CreateSubscriptionInput = {
  userId: string
  tenantId: string
  stripeSubscriptionId: string
  stripeCustomerId: string
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'INCOMPLETE'
  currentPeriodStart: string
  currentPeriodEnd: string
}

export type UpdateSubscriptionInput = {
  id?: string
  stripeSubscriptionId?: string
  status?: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'INCOMPLETE'
  currentPeriodEnd?: string
  canceledAt?: string
}

export type UpdateUserSettingsInput = {
  userId: string
  theme?: 'light' | 'dark' | 'system'
  language?: string
  timezone?: string
  emailNotifications?: boolean
  browserNotifications?: boolean
  marketingEmails?: boolean
  billingNotifications?: boolean
}

// Common GraphQL operations
export const graphqlOperations = {
  // User operations
  async getUser(id: string) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
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
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id }
    })
  },

  async getUserByEmail(email: string) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        query GetUserByEmail($email: String!) {
          getUserByEmail(email: $email) {
            id
            email
            name
            avatar
            tenantId
            authProvider
            googleId
            emailVerified
          }
        }
      `,
      variables: { email }
    })
  },

  async createUser(input: CreateUserInput) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            email
            name
            avatar
            tenantId
            authProvider
            googleId
            emailVerified
          }
        }
      `,
      variables: { input }
    })
  },

  async updateUser(input: UpdateUserInput) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation UpdateUser($input: UpdateUserInput!) {
          updateUser(input: $input) {
            id
            email
            name
            avatar
            emailVerified
          }
        }
      `,
      variables: { input }
    })
  },

  // Subscription operations
  async getUserSubscription(userId: string) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        query GetUserSubscription($userId: ID!) {
          getUserSubscription(userId: $userId) {
            id
            userId
            stripeSubscriptionId
            stripeCustomerId
            status
            currentPeriodStart
            currentPeriodEnd
            canceledAt
            createdAt
          }
        }
      `,
      variables: { userId }
    })
  },

  async createSubscription(input: CreateSubscriptionInput) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation CreateSubscription($input: CreateSubscriptionInput!) {
          createSubscription(input: $input) {
            id
            userId
            stripeSubscriptionId
            stripeCustomerId
            status
            currentPeriodStart
            currentPeriodEnd
          }
        }
      `,
      variables: { input }
    })
  },

  async updateSubscription(input: UpdateSubscriptionInput) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation UpdateSubscription($input: UpdateSubscriptionInput!) {
          updateSubscription(input: $input) {
            id
            status
            currentPeriodEnd
            canceledAt
          }
        }
      `,
      variables: { input }
    })
  },

  // Settings operations
  async getUserSettings(userId: string) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        query GetUserSettings($userId: ID!) {
          getUserSettings(userId: $userId) {
            id
            userId
            theme
            language
            timezone
            emailNotifications
            browserNotifications
            marketingEmails
            billingNotifications
          }
        }
      `,
      variables: { userId }
    })
  },

  async updateUserSettings(input: UpdateUserSettingsInput) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation UpdateUserSettings($input: UpdateUserSettingsInput!) {
          updateUserSettings(input: $input) {
            id
            theme
            language
            timezone
            emailNotifications
            browserNotifications
            marketingEmails
            billingNotifications
          }
        }
      `,
      variables: { input }
    })
  },

  // OAuth operations
  async linkGoogleAccount(input: { googleToken: string; googleId: string }) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation LinkGoogleAccount($input: LinkGoogleAccountInput!) {
          linkGoogleAccount(input: $input) {
            id
            authProvider
            googleId
          }
        }
      `,
      variables: { input }
    })
  },

  async unlinkGoogleAccount(userId: string) {
    const graphqlClient = getGraphQLClient()
    if (!graphqlClient) {
      throw new Error('GraphQL client not available')
    }
    return await graphqlClient.graphql({
      query: `
        mutation UnlinkGoogleAccount($userId: ID!) {
          unlinkGoogleAccount(userId: $userId) {
            id
            authProvider
            googleId
          }
        }
      `,
      variables: { userId }
    })
  }
}

export default client