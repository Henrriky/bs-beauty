import { prismaClient } from '@/lib/prisma'
import { PERMISSIONS_MAP } from '@/utils/auth/permissions-map.util'
import { AppLoggerInstance } from '@/utils/logger/logger.util'

interface PermissionData {
  resource: string
  action: string
  description?: string
}

export class PermissionSeederService {
  private readonly logger = AppLoggerInstance

  async seedPermissions (): Promise<void> {
    this.logger.info('Starting permission seeding process', {
      context: 'PermissionSeederService'
    })

    try {
      const permissionsToSeed = this.extractPermissionsFromMap()

      this.logger.info(`Found ${permissionsToSeed.length} permissions to process`, {
        context: 'PermissionSeederService',
        permissionsCount: permissionsToSeed.length
      })

      let createdCount = 0
      let existingCount = 0

      for (const permission of permissionsToSeed) {
        const existingPermission = await prismaClient.permission.findFirst({
          where: {
            resource: permission.resource,
            action: permission.action
          }
        })

        if (!existingPermission) {
          await prismaClient.permission.create({
            data: permission
          })
          createdCount++

          this.logger.info(`Created permission: ${permission.resource}.${permission.action}`, {
            context: 'PermissionSeederService',
            resource: permission.resource,
            action: permission.action
          })
        } else {
          existingCount++
        }
      }

      this.logger.info('Permission seeding completed successfully', {
        context: 'PermissionSeederService',
        createdCount,
        existingCount,
        totalProcessed: permissionsToSeed.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed permissions', errorDetails, {
        context: 'PermissionSeederService'
      })
      throw error
    }
  }

  private extractPermissionsFromMap (): PermissionData[] {
    const permissions: PermissionData[] = []

    Object.keys(PERMISSIONS_MAP).forEach(moduleKey => {
      const module = PERMISSIONS_MAP[moduleKey as keyof typeof PERMISSIONS_MAP]

      Object.keys(module).forEach(permissionKey => {
        const permissionObject = module[permissionKey as keyof typeof module] as {
          permissionName: string
          description: string
        }

        const permissionName = permissionObject.permissionName
        const permissionDescription = permissionObject.description

        const [resource, action] = permissionName.split('.')

        if (resource && action) {
          permissions.push({
            resource,
            action,
            description: permissionDescription
          })
        }
      })
    })

    return permissions
  }

  async verifyPermissions (): Promise<boolean> {
    try {
      const permissionsFromMap = this.extractPermissionsFromMap()
      const existingPermissions = await prismaClient.permission.findMany({
        select: {
          resource: true,
          action: true
        }
      })

      const existingPermissionSet = new Set(
        existingPermissions.map((p: { resource: string, action: string }) => `${p.resource}.${p.action}`)
      )

      const missingPermissions = permissionsFromMap.filter(
        p => !existingPermissionSet.has(`${p.resource}.${p.action}`)
      )

      if (missingPermissions.length > 0) {
        this.logger.warn('Missing permissions found in database', {
          context: 'PermissionSeederService',
          missingCount: missingPermissions.length,
          missingPermissions: missingPermissions.map(p => `${p.resource}.${p.action}`)
        })
        return false
      }

      this.logger.info('All permissions verified - database is up to date', {
        context: 'PermissionSeederService',
        totalPermissions: permissionsFromMap.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to verify permissions', errorDetails, {
        context: 'PermissionSeederService'
      })
      return false
    }
  }
}

export const permissionSeeder = new PermissionSeederService()
