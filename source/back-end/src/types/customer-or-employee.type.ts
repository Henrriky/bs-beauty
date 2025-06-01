import { type UserType } from '@prisma/client'

interface CustomerOrEmployee {
  id: string
  userType: UserType
  email: string
  name: string | null
  registerCompleted: boolean
  userId: string
  profilePhotoUrl: string | null
}

export type { CustomerOrEmployee }
