import { type Permissions } from '@/utils/auth/permissions-map.util'
import { type Permission } from '@prisma/client'

export class PrismaPermissionMapper {
  static toDomain (prismaPermission: Permission): Permissions {
    return `${prismaPermission.resource}.${prismaPermission.action}` as Permissions
  }
}
