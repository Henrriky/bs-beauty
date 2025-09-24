import { type Prisma } from '@prisma/client'
import { type PaymentRecordRepository } from '../protocols/payment-record.repository'
import { prismaClient } from '@/lib/prisma'

class PrismaPaymentRecordRepository implements PaymentRecordRepository {
  public async findById (id: string) {
    const paymentRecord = await prismaClient.paymentRecord.findUnique({
      where: { id }
    })

    return paymentRecord
  }

  public async findByProfessionalId (professionalId: string) {
    const paymentsRecords = await prismaClient.paymentRecord.findMany({
      where: { professionalId }
    })

    return paymentsRecords
  }

  public async create (data: Prisma.PaymentRecordCreateInput) {
    const newPaymentRecord = await prismaClient.paymentRecord.create({ data })

    return newPaymentRecord
  }

  public async update (id: string, data: Prisma.PaymentRecordUpdateInput) {
    const updatedPaymentRecord = await prismaClient.paymentRecord.update({
      where: { id },
      data
    })

    return updatedPaymentRecord
  }
}

export { PrismaPaymentRecordRepository }
