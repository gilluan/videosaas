// Dynamic imports to prevent build-time Amplify initialization
let amplifyAuth: typeof import('aws-amplify/auth') | null = null
let amplifyApi: typeof import('aws-amplify/api') | null = null

async function getAmplifyAuth() {
  if (!amplifyAuth && typeof window !== 'undefined') {
    amplifyAuth = await import('aws-amplify/auth')
  }
  return amplifyAuth
}

async function getAmplifyApi() {
  if (!amplifyApi && typeof window !== 'undefined') {
    amplifyApi = await import('aws-amplify/api')
  }
  return amplifyApi
}

// Helper function to get client safely
async function getGraphQLClient() {
  // Don't try to create client during build process
  if (typeof window === 'undefined') {
    return null
  }

  const api = await getAmplifyApi()
  if (!api) {
    return null
  }

  return api.generateClient()
}

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
      // Don't try to get user during build process
      if (typeof window === 'undefined') {
        return null
      }

      const auth = await getAmplifyAuth()
      if (!auth) {
        return null
      }

      const cognitoUser = await auth.getCurrentUser()

      // Get user data from our GraphQL API
      const client = await getGraphQLClient()
      if (!client) {
        return null
      }

      const result = await client.graphql({
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

      const data = 'data' in result ? result.data : null
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

        const client = getGraphQLClient()
        if (!client) {
          throw new Error('GraphQL client not available')
        }

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
      const client = getGraphQLClient()
      if (!client) {
        throw new Error('GraphQL client not available')
      }

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

  async handleOAuthCallback(user: AuthUser): Promise<User> {
    try {
      const userAttributes = user.attributes as { email?: string; name?: string; picture?: string } | undefined
      const { email, name, picture } = userAttributes || {}
      const googleId = user.username // Cognito maps Google ID to username

      // Check if user already exists
      const client = getGraphQLClient()
      if (!client) {
        throw new Error('GraphQL client not available')
      }

      const existingUserResult = await client.graphql({
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

      const existingUserData = 'data' in existingUserResult ? existingUserResult.data : null
      if (existingUserData?.getUserByEmail) {
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
              googleToken: undefined, // No longer accessing session token directly
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