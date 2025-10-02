import { type PaymentRecordRepository, type CreatePaymentRecordInput, type UpdatePaymentRecordInput } from '../protocols/payment-record.repository'
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

  public async create (data: CreatePaymentRecordInput) {
    const totalValue = data.items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity * (1 - item.discount)
      return sum + itemTotal
    }, 0)

    const newPaymentRecord = await prismaClient.paymentRecord.create({
      data: {
        totalValue,
        paymentMethod: data.paymentMethod,
        customerId: data.customerId,
        professionalId: data.professionalId,
        items: {
          create: data.items.map(item => ({
            quantity: item.quantity,
            discount: item.discount,
            price: item.price,
            offerId: item.offerId
          }))
        }
      },
      include: {
        items: true
      }
    })

    return newPaymentRecord
  }

  public async update (id: string, data: UpdatePaymentRecordInput) {
    const totalValue = data.items?.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity * (1 - item.discount)
      return sum + itemTotal
    }, 0)

    const updatedPaymentRecord = await prismaClient.paymentRecord.update({
      where: { id },
      data: {
        totalValue,
        ...data,
        items: {
          update: data.items?.map(item => ({
            where: {
              id: item.id
            },
            data: {
              quantity: item.quantity,
              discount: item.discount,
              price: item.price,
              offerId: item.offerId
            }
          }))
        }
      }
    })

    return updatedPaymentRecord
  }

  public async delete (id: string) {
    const deletedPaymentRecord = await prismaClient.paymentRecord.delete({
      where: { id }
    })

    return deletedPaymentRecord
  }
}

export { PrismaPaymentRecordRepository }
