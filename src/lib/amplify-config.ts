import { Amplify } from 'aws-amplify'

// Temporary configuration for development
// This will be replaced with actual amplify_outputs.json when backend is deployed
const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'temp-pool-id',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'temp-client-id',
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || 'temp-identity-pool-id',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'temp-domain',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`],
          redirectSignOut: [`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`],
          responseType: 'code',
        },
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://temp-api.amazonaws.com/graphql',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
}

// Configure Amplify
Amplify.configure(config)

export default Amplify