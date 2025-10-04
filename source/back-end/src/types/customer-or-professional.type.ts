import { type Permissions } from '@/utils/auth/permissions-map.util'
import { type UserType } from '@prisma/client'

interface CustomerOrProfessional {
  id: string
  userType: UserType
  email: string
  name: string | null
  registerCompleted: boolean
  userId: string
  profilePhotoUrl: string | null
  permissions: Permissions[]
}

export type { CustomerOrProfessional }
