import { type CustomerOrProfessional } from '../../types/customer-or-professional.type'

interface Encrypter {
  encrypt: (params: CustomerOrProfessional & { userId: string, profilePhotoUrl: string }) => Promise<{ accessToken: string }>
}

export type { Encrypter }
