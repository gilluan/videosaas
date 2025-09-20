'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authUtils, type User, type AuthContextType } from './auth-utils'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authUtils.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authUtils.signIn(email, password)
      const user = await authUtils.getCurrentUser()
      setUser(user)
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      await authUtils.signUp(email, password, name)
      // User will need to verify email before they can sign in
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await authUtils.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    try {
      await authUtils.signInWithGoogle()
      // OAuth redirect will handle the rest
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const confirmSignUp = async (email: string, code: string) => {
    setIsLoading(true)
    try {
      await authUtils.confirmSignUp(email, code)
      // User can now sign in
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resendConfirmationCode = async (email: string) => {
    try {
      await authUtils.resendConfirmationCode(email)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    confirmSignUp,
    resendConfirmationCode,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}