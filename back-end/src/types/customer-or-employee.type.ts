import { type Role } from '@prisma/client'

interface CustomerOrEmployee {
  role: Role
  email: string
  name: string | null
  registerCompleted: boolean
  profilePhotoUrl: string
}

export type { CustomerOrEmployee }
