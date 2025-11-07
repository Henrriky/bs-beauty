import { prismaClient } from '@/lib/prisma'
import { AppLoggerInstance } from '@/utils/logger/logger.util'

class PaymentRecordSeeder {
  private readonly logger = AppLoggerInstance

  public async seedPaymentRecords(): Promise<void> {
    this.logger.info('Starting payment records seeding', {
      context: 'PaymentRecordSeeder'
    })

    try {
      const professionals = await prismaClient.professional.findMany({
        take: 3
      })

      const customers = await prismaClient.customer.findMany({
        take: 5
      })

      if (professionals.length === 0 || customers.length === 0) {
        this.logger.warn('No professionals or customers found, skipping payment records seeding', {
          context: 'PaymentRecordSeeder'
        })
        return
      }

      const existingPayments = await prismaClient.paymentRecord.count()

      if (existingPayments > 0) {
        this.logger.info('Payment records already exist, skipping seeding', {
          context: 'PaymentRecordSeeder',
          count: existingPayments
        })
        return
      }

      const paymentMethods = ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH']
      const paymentsToCreate = []

      const today = new Date()
      const threeMonthsAgo = new Date(today)
      threeMonthsAgo.setMonth(today.getMonth() - 3)

      for (let i = 0; i < 90; i++) {
        const randomDate = new Date(
          threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime())
        )

        const randomProfessional = professionals[Math.floor(Math.random() * professionals.length)]
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
        const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
        const randomValue = Math.floor(Math.random() * 30000 + 5000) / 100

        paymentsToCreate.push({
          totalValue: randomValue,
          paymentMethod: randomMethod,
          customerId: randomCustomer.id,
          professionalId: randomProfessional.id,
          createdAt: randomDate,
          updatedAt: randomDate
        })
      }

      await prismaClient.paymentRecord.createMany({
        data: paymentsToCreate
      })

      this.logger.info('Payment records seeded successfully', {
        context: 'PaymentRecordSeeder',
        count: paymentsToCreate.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed payment records', errorDetails, {
        context: 'PaymentRecordSeeder'
      })

      throw error
    }
  }

  public async verifyPaymentRecords(): Promise<boolean> {
    try {
      const count = await prismaClient.paymentRecord.count()
      return count > 0
    } catch (error) {
      return false
    }
  }
}

export const paymentRecordSeeder = new PaymentRecordSeeder()
