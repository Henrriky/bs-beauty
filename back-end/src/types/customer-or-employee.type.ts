import { type Role } from '@prisma/client'

interface CustomerOrEmployee {
  id: string
  role: Role
  email: string
  name: string | null
  registerCompleted: boolean
  userId: string
  profilePhotoUrl: string | null
}

export type { CustomerOrEmployee }
