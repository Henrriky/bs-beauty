import { type PaginatedRequest } from '@/types/pagination'
import { type PaymentRecordRepository, type CreatePaymentRecordInput, type UpdatePaymentRecordInput } from '../protocols/payment-record.repository'
import { prismaClient } from '@/lib/prisma'
import { type PartialPaymentRecordQuerySchema } from '@/utils/validation/zod-schemas/pagination/payment-records/payment-records-query.schema'

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

  public async findByProfessionalIdPaginated (professionalId: string, params: PaginatedRequest<PartialPaymentRecordQuerySchema>) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prismaClient.paymentRecord.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        where: { professionalId }
      }),
      prismaClient.paymentRecord.count({
        where: { professionalId }
      })
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    }
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
