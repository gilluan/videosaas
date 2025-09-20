import { getCurrentUser, signOut, signIn, signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { generateClient } from 'aws-amplify/api'
import type { Schema } from '../../amplify/data/resource'

const client = generateClient<Schema>()

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  tenantId: string
  authProvider: 'EMAIL' | 'GOOGLE' | 'LINKED'
  googleId?: string
  emailVerified: boolean
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  confirmSignUp: (email: string, code: string) => Promise<void>
  resendConfirmationCode: (email: string) => Promise<void>
}

// Generate unique tenant ID for new users
export function generateTenantId(): string {
  return crypto.randomUUID()
}

// Auth utility functions
export const authUtils = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const cognitoUser = await getCurrentUser()

      // Get user data from our GraphQL API
      const { data } = await client.graphql({
        query: `
          query GetCurrentUser($id: ID!) {
            getUser(id: $id) {
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
        variables: { id: cognitoUser.userId }
      })

      if (data?.getUser) {
        return data.getUser as User
      }

      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signIn({ username: email, password })
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  },

  async signUp(email: string, password: string, name: string): Promise<void> {
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          }
        }
      })

      // Create user record in our database
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        const tenantId = generateTenantId()

        await client.graphql({
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                id
                email
                name
                tenantId
                authProvider
                emailVerified
              }
            }
          `,
          variables: {
            input: {
              email,
              name,
              tenantId,
              authProvider: 'EMAIL',
              emailVerified: false
            }
          }
        })
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  },

  async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      await confirmSignUp({ username: email, confirmationCode: code })

      // Update user as email verified
      await client.graphql({
        query: `
          mutation UpdateUserEmailVerified($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
              emailVerified
            }
          }
        `,
        variables: {
          input: {
            email,
            emailVerified: true
          }
        }
      })
    } catch (error) {
      console.error('Confirm sign up error:', error)
      throw error
    }
  },

  async resendConfirmationCode(email: string): Promise<void> {
    try {
      await resendSignUpCode({ username: email })
    } catch (error) {
      console.error('Resend confirmation code error:', error)
      throw error
    }
  },

  async signOut(): Promise<void> {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  },

  async signInWithGoogle(): Promise<void> {
    try {
      // This will redirect to Google OAuth
      const { signInWithRedirect } = await import('aws-amplify/auth')
      await signInWithRedirect({ provider: 'Google' })
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  },

  async handleOAuthCallback(user: any): Promise<User> {
    try {
      const { email, name, picture } = user.attributes
      const googleId = user.username // Cognito maps Google ID to username

      // Check if user already exists
      const { data: existingUser } = await client.graphql({
        query: `
          query GetUserByEmail($email: String!) {
            getUserByEmail(email: $email) {
              id
              authProvider
            }
          }
        `,
        variables: { email }
      })

      if (existingUser?.getUserByEmail) {
        // Link Google account to existing user
        await client.graphql({
          query: `
            mutation LinkGoogleAccount($input: LinkGoogleAccountInput!) {
              linkGoogleAccount(input: $input) {
                id
                authProvider
                googleId
              }
            }
          `,
          variables: {
            input: {
              googleToken: user.signInUserSession?.accessToken?.jwtToken,
              googleId
            }
          }
        })
      } else {
        // Create new user with Google auth
        const tenantId = generateTenantId()

        await client.graphql({
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                id
                email
                name
                tenantId
                authProvider
                googleId
                emailVerified
              }
            }
          `,
          variables: {
            input: {
              email,
              name: name || email.split('@')[0],
              avatar: picture,
              tenantId,
              authProvider: 'GOOGLE',
              googleId,
              emailVerified: true
            }
          }
        })
      }

      return await this.getCurrentUser() as User
    } catch (error) {
      console.error('OAuth callback error:', error)
      throw error
    }
  }
}