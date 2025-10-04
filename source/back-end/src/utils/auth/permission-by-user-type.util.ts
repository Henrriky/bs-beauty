import { UserType } from '@prisma/client'

export const permissionsByUserType: Record<UserType, string[]> = {
  [UserType.MANAGER]: [
    'DASHBOARD.TOTAL_EMPLOYEES',
    'PROFESSIONAL.READ',
    'PROFESSIONAL.CREATE',
    'PROFESSIONAL.DELETE',
    'PROFESSIONAL.MANAGE_ROLES',
    'CUSTOMER.READ',
    'SERVICE.READ'
  ],
  [UserType.PROFESSIONAL]: [
    'SERVICE.READ',
    'SERVICE.CREATE',
    'SERVICE.EDIT',
    'SERVICE.APPROVE',
    'SERVICE.DELETE'
  ],
  [UserType.CUSTOMER]: []
}
