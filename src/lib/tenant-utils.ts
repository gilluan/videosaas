import { authUtils, type User } from './auth-utils'
import { graphqlOperations } from './graphql-client'

export interface TenantContext {
  tenantId: string
  user: User
}

export const tenantUtils = {
  // Get current tenant context from authenticated user
  async getCurrentTenant(): Promise<TenantContext | null> {
    try {
      const user = await authUtils.getCurrentUser()
      if (!user || !user.tenantId) {
        return null
      }

      return {
        tenantId: user.tenantId,
        user,
      }
    } catch (error) {
      console.error('Error getting current tenant:', error)
      return null
    }
  },

  // Validate that a resource belongs to the current tenant
  async validateTenantAccess(resourceTenantId: string): Promise<boolean> {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        return false
      }

      return tenant.tenantId === resourceTenantId
    } catch (error) {
      console.error('Error validating tenant access:', error)
      return false
    }
  },

  // Generate a new tenant ID for new users
  generateTenantId(): string {
    return crypto.randomUUID()
  },

  // Get all users in the current tenant (for admin purposes)
  async getTenantUsers(): Promise<User[]> {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        throw new Error('No tenant context available')
      }

      // Note: This would need a custom GraphQL query to list users by tenant
      // For now, returning empty array as placeholder
      console.warn('getTenantUsers not fully implemented - needs custom resolver')
      return []
    } catch (error) {
      console.error('Error getting tenant users:', error)
      throw error
    }
  },

  // Check if current user is admin for their tenant
  async isCurrentUserTenantAdmin(): Promise<boolean> {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        return false
      }

      // For MVP, the user who created the tenant is the admin
      // In a full implementation, this would check a role field
      // For now, all users are considered admins of their own tenant
      return true
    } catch (error) {
      console.error('Error checking tenant admin status:', error)
      return false
    }
  },

  // Ensure tenant isolation in data queries
  addTenantFilter(filters: Record<string, unknown>, tenantId: string): Record<string, unknown> {
    return {
      ...filters,
      tenantId: { eq: tenantId },
    }
  },

  // Get tenant-specific subscription information
  async getTenantSubscription() {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        return null
      }

      const result = await graphqlOperations.getUserSubscription(tenant.user.id)
      const data = 'data' in result ? result.data : null
      return data?.getUserSubscription || null
    } catch (error) {
      console.error('Error getting tenant subscription:', error)
      return null
    }
  },

  // Get tenant-specific settings
  async getTenantSettings() {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        return null
      }

      const result = await graphqlOperations.getUserSettings(tenant.user.id)
      const data = 'data' in result ? result.data : null
      return data?.getUserSettings || null
    } catch (error) {
      console.error('Error getting tenant settings:', error)
      return null
    }
  },

  // Update tenant settings
  async updateTenantSettings(settings: Record<string, unknown>) {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        throw new Error('No tenant context available')
      }

      const result = await graphqlOperations.updateUserSettings({
        userId: tenant.user.id,
        ...settings,
      })

      const data = 'data' in result ? result.data : null
      return data?.updateUserSettings
    } catch (error) {
      console.error('Error updating tenant settings:', error)
      throw error
    }
  },

  // Check tenant subscription status
  async checkSubscriptionAccess(requiredPlan?: string): Promise<boolean> {
    try {
      const subscription = await this.getTenantSubscription()

      if (!subscription) {
        // No subscription - only free tier access
        return !requiredPlan || requiredPlan === 'free'
      }

      if (subscription.status !== 'ACTIVE') {
        // Inactive subscription - no paid features
        return !requiredPlan || requiredPlan === 'free'
      }

      // For MVP, any active subscription grants access to all features
      // In a full implementation, this would check specific plan tiers
      return true
    } catch (error) {
      console.error('Error checking subscription access:', error)
      return false
    }
  },

  // Get tenant usage metrics (placeholder for analytics)
  async getTenantMetrics() {
    try {
      const tenant = await this.getCurrentTenant()
      if (!tenant) {
        return null
      }

      // Placeholder metrics - in a real app, this would query actual usage data
      return {
        projects: 5,
        storageUsed: 1.2, // GB
        apiCalls: 1250,
        activeUsers: 1,
        lastActivity: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error getting tenant metrics:', error)
      return null
    }
  },
}