import { type UserType } from '@prisma/client'

interface CustomerOrProfessional {
  id: string
  userType: UserType
  email: string
  name: string | null
  registerCompleted: boolean
  userId: string
  profilePhotoUrl: string | null
}

export type { CustomerOrProfessional }
