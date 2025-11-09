import { describe, expect, it } from 'vitest'
import { PermissionChecker } from '@/utils/auth/permission-checker.util'

describe('PermissionChecker', () => {
  describe('hasPermission', () => {
    it('should return true when user has the required permission', () => {
      const userPermissions = ['professional.read', 'professional.create', 'customer.read']
      const requiredPermission = 'professional.read'

      const result = PermissionChecker.hasPermission(userPermissions as any, requiredPermission as any)

      expect(result).toBe(true)
    })

    it('should return false when user does not have the required permission', () => {
      const userPermissions = ['professional.read', 'customer.read']
      const requiredPermission = 'professional.delete'

      const result = PermissionChecker.hasPermission(userPermissions as any, requiredPermission as any)

      expect(result).toBe(false)
    })

    it('should return false when user has empty permissions array', () => {
      const userPermissions: string[] = []
      const requiredPermission = 'professional.read'

      const result = PermissionChecker.hasPermission(userPermissions as any, requiredPermission as any)

      expect(result).toBe(false)
    })

    it('should return true when checking for multiple permissions', () => {
      const userPermissions = [
        'dashboard.total_employees',
        'professional.read',
        'professional.create',
        'service.create',
        'roles.read'
      ]

      expect(PermissionChecker.hasPermission(userPermissions as any, 'dashboard.total_employees' as any)).toBe(true)
      expect(PermissionChecker.hasPermission(userPermissions as any, 'professional.read' as any)).toBe(true)
      expect(PermissionChecker.hasPermission(userPermissions as any, 'service.create' as any)).toBe(true)
    })

    it('should handle case-sensitive permission names', () => {
      const userPermissions = ['professional.read']
      const requiredPermission = 'Professional.Read'

      const result = PermissionChecker.hasPermission(userPermissions as any, requiredPermission as any)

      expect(result).toBe(false)
    })
  })
})
