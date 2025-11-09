import { firstLetterOfWordToUpperCase } from './../../../utils/formatter/first-letter-of-word-to-upper-case.util'
import { UserType } from '../../../store/auth/types'

const userTypeToPrettyNameMap: Record<UserType, string> = {
  [UserType.MANAGER]: 'Gerente',
  [UserType.PROFESSIONAL]: 'Profissional',
  [UserType.CUSTOMER]: 'Cliente',
}

export const getPrettyRoles = (
  userType: UserType,
  roles: string[],
  isCommissioned: boolean,
) => {
  const userTypePrettyName = userTypeToPrettyNameMap[userType] || 'Desconhecido'

  const rolesPrettyName = roles
    .map((role) => firstLetterOfWordToUpperCase(role))
    .join(', ')

  return `${userTypePrettyName} ${rolesPrettyName && `(${rolesPrettyName})`} ${isCommissioned ? 'Comissionada (o)' : ''}`
}
