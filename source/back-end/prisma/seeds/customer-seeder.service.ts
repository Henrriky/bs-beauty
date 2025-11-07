import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { generateCustomersData, type CustomerSeedData } from './data/customers.data'
import { prismaClient } from '@/lib/prisma'

export class CustomerSeederService {
  private readonly logger = AppLoggerInstance

  async seedCustomers(): Promise<void> {
    this.logger.info('Starting customer seeding process', {
      context: 'CustomerSeederService'
    })

    try {
      const customersToSeed = generateCustomersData()

      this.logger.info(`Found ${customersToSeed.length} customers to process`, {
        context: 'CustomerSeederService',
        customersCount: customersToSeed.length
      })

      let createdCount = 0
      let existingCount = 0
      let updatedCount = 0

      for (const customerData of customersToSeed) {
        const existingCustomer = await prismaClient.customer.findUnique({
          where: {
            email: customerData.email
          }
        })

        if (!existingCustomer) {
          await prismaClient.customer.create({
            data: {
              name: customerData.name,
              email: customerData.email,
              passwordHash: customerData.passwordHash,
              phone: customerData.phone,
              birthdate: customerData.birthdate,
              registerCompleted: customerData.registerCompleted,
              userType: customerData.userType,
              referralCount: customerData.referralCount,
              alwaysAllowImageUse: customerData.alwaysAllowImageUse,
              discoverySource: customerData.discoverySource,
              notificationPreference: customerData.notificationPreference
            }
          })
          createdCount++

          this.logger.info(`Created customer: ${customerData.name}`, {
            context: 'CustomerSeederService',
            email: customerData.email
          })
        } else {
          await prismaClient.customer.update({
            where: { email: customerData.email },
            data: {
              name: customerData.name,
              birthdate: customerData.birthdate,
              referralCount: customerData.referralCount,
              alwaysAllowImageUse: customerData.alwaysAllowImageUse,
              discoverySource: customerData.discoverySource,
              notificationPreference: customerData.notificationPreference
            }
          })
          updatedCount++
          existingCount++

          this.logger.info(`Updated existing customer: ${customerData.name}`, {
            context: 'CustomerSeederService',
            email: customerData.email
          })
        }
      }

      this.logger.info('Customer seeding completed successfully', {
        context: 'CustomerSeederService',
        createdCount,
        existingCount,
        updatedCount,
        totalProcessed: customersToSeed.length
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to seed customers', errorDetails, {
        context: 'CustomerSeederService'
      })
      throw error
    }
  }

  async verifyCustomers(): Promise<boolean> {
    try {
      const customersData = generateCustomersData()
      const existingCustomers = await prismaClient.customer.findMany({
        where: {
          email: {
            in: customersData.map((c: CustomerSeedData) => c.email)
          }
        },
        select: {
          email: true,
          name: true
        }
      })

      const existingEmails = new Set(existingCustomers.map((c: { email: string }) => c.email))
      const missingCustomers = customersData.filter(
        (c: CustomerSeedData) => !existingEmails.has(c.email)
      )

      if (missingCustomers.length > 0) {
        this.logger.warn('Missing customers found in database', {
          context: 'CustomerSeederService',
          missingCount: missingCustomers.length,
          missingCustomers: missingCustomers.map((c: CustomerSeedData) => c.email)
        })
        return false
      }

      this.logger.info('All customers verified - database is up to date', {
        context: 'CustomerSeederService',
        totalCustomers: customersData.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error('Failed to verify customers', errorDetails, {
        context: 'CustomerSeederService'
      })
      return false
    }
  }
}

export const customerSeeder = new CustomerSeederService()
