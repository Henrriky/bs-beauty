import { type PaymentRecord, type Prisma } from '@prisma/client'

interface PaymentRecordRepository {
  findById: (id: string) => Promise<PaymentRecord | null>
  findByProfessionalId: (professionalId: string) => Promise<PaymentRecord[]>
  create: (data: Prisma.PaymentRecordCreateInput) => Promise<PaymentRecord>
  update: (id: string, data: Prisma.PaymentRecordUpdateInput) => Promise<PaymentRecord>
}

export { type PaymentRecordRepository }
