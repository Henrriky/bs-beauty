import { type PrismaClient } from '@prisma/client'
import { generatePaymentRecordsData } from './data/payment-records.data'
import { BaseRelationSeederService } from './base-relation-seeder.service'

import { prismaClient } from '../../src/lib/prisma'

export class PaymentRecordSeederService extends BaseRelationSeederService {
  private readonly entityName = 'payment-record'

  constructor(private readonly prismaClient: PrismaClient) {
    super()
  }

  async seedPaymentRecords(): Promise<void> {
    this.logSeedingStart(this.entityName)

    const existingCount = await this.prismaClient.paymentRecord.count()

    if (existingCount >= 100) {
      this.logInfo(
        this.entityName,
        `Skipping seed - already have ${existingCount} payment records (limit: 100)`
      )
      return
    }

    const paymentRecords = generatePaymentRecordsData()
    let createdCount = 0
    let skippedCount = 0

    for (const paymentRecord of paymentRecords) {
      const customer = await this.prismaClient.customer.findUnique({
        where: { email: paymentRecord.customerEmail }
      })

      if (!customer) {
        this.logWarning(this.entityName, `Customer not found: ${paymentRecord.customerEmail}`)
        skippedCount++
        continue
      }

      const professional = await this.prismaClient.professional.findFirst({
        where: { name: paymentRecord.professionalName }
      })

      if (!professional) {
        this.logWarning(this.entityName, `Professional not found: ${paymentRecord.professionalName}`)
        skippedCount++
        continue
      }

      const offerIds: Array<{ offerId: string, quantity: number, discount: number, price: number }> = []

      for (const item of paymentRecord.items) {
        const service = await this.prismaClient.service.findFirst({
          where: { name: item.offerInfo.serviceName }
        })

        if (!service) {
          this.logWarning(this.entityName, `Service not found: ${item.offerInfo.serviceName}`)
          continue
        }

        const offer = await this.prismaClient.offer.findFirst({
          where: {
            serviceId: service.id,
            professionalId: professional.id
          }
        })

        if (!offer) {
          this.logWarning(
            this.entityName,
            `Offer not found for service "${item.offerInfo.serviceName}" and professional "${paymentRecord.professionalName}"`
          )
          continue
        }

        offerIds.push({
          offerId: offer.id,
          quantity: item.quantity,
          discount: item.discount,
          price: item.price
        })
      }

      if (offerIds.length === 0) {
        this.logWarning(
          this.entityName,
          'No valid offers found for payment record - skipping'
        )
        skippedCount++
        continue
      }

      await this.prismaClient.paymentRecord.create({
        data: {
          totalValue: paymentRecord.totalValue,
          paymentMethod: paymentRecord.paymentMethod,
          customerId: customer.id,
          professionalId: professional.id,
          createdAt: paymentRecord.createdAt,
          items: {
            create: offerIds.map((item) => ({
              quantity: item.quantity,
              discount: item.discount,
              price: item.price,
              offerId: item.offerId
            }))
          }
        }
      })

      createdCount++
    }

    this.logSeedingComplete(this.entityName, { createdCount, skippedCount })
  }

  async verifyPaymentRecords(): Promise<void> {
    this.logVerificationStart(this.entityName)

    const totalPaymentRecords = await this.prismaClient.paymentRecord.count()
    const totalPaymentItems = await this.prismaClient.paymentItem.count()

    this.logInfo(this.entityName, `Total payment records: ${totalPaymentRecords}`)
    this.logInfo(this.entityName, `Total payment items: ${totalPaymentItems}`)

    const paymentsByMethod = await this.prismaClient.paymentRecord.groupBy({
      by: ['paymentMethod'],
      _count: { paymentMethod: true },
      _sum: { totalValue: true }
    })

    for (const methodGroup of paymentsByMethod) {
      this.logInfo(
        this.entityName,
        `Payment method "${methodGroup.paymentMethod}": ${methodGroup._count.paymentMethod} records, total: R$ ${methodGroup._sum.totalValue?.toFixed(2) ?? '0.00'}`
      )
    }

    this.logVerificationComplete(this.entityName)
  }
}

export const paymentRecordSeeder = new PaymentRecordSeederService(prismaClient)
