import { type CustomerOrEmployee } from '../../types/customer-or-employee.type'

interface Encrypter {
  encrypt: (params: CustomerOrEmployee & { userId: string, profilePhotoUrl: string }) => Promise<{ accessToken: string }>
}

export type { Encrypter }
