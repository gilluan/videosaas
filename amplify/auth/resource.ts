import { defineAuth } from '@aws-amplify/backend'

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to VideoSaaS - Verify your email',
      verificationEmailBody: (createCode) =>
        `Welcome to VideoSaaS! Your verification code is ${createCode()}`,
    },
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        scopes: ['openid', 'email', 'profile'],
      },
      callbackUrls: [
        process.env.NEXT_PUBLIC_APP_URL + '/auth/callback',
        'http://localhost:3000/auth/callback',
      ],
      logoutUrls: [
        process.env.NEXT_PUBLIC_APP_URL,
        'http://localhost:3000',
      ],
    },
  },
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    name: {
      required: true,
      mutable: true,
    },
    picture: {
      required: false,
      mutable: true,
    },
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
})