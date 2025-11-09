import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { permissionSeeder } from './permission-seeder.service'
import { professionalSeeder } from './professional-seeder.service'
import { customerSeeder } from './customer-seeder.service'
import { serviceSeeder } from './service-seeder.service'
import { offerSeeder } from './offer-seeder.service'
import { shiftSeeder } from './shift-seeder.service'
import { appointmentSeeder } from './appointment-seeder.service'
import { notificationTemplateSeeder } from './notification-template-seeder.service'
import { notificationSeeder } from './notification-seeder.service'
import { ratingSeeder } from './rating-seeder.service'

export async function runDatabaseSeeds(): Promise<void> {
  const logger = AppLoggerInstance

  logger.info('Starting database seeding process', {
    context: 'DatabaseSeeds'
  })

  try {
    await permissionSeeder.seedPermissions()
    await notificationTemplateSeeder.seedNotificationTemplates()
    await professionalSeeder.seedProfessionals()
    await customerSeeder.seedCustomers()
    await serviceSeeder.seedServices()
    await offerSeeder.seedOffers()
    await shiftSeeder.seedShifts()
    await appointmentSeeder.seedAppointments()
    await ratingSeeder.seedRatings()
    await notificationSeeder.seedNotifications()

    logger.info('Database seeding completed successfully', {
      context: 'DatabaseSeeds'
    })
  } catch (error) {
    const errorDetails = error instanceof Error ? error : undefined

    logger.error('Database seeding failed', errorDetails, {
      context: 'DatabaseSeeds'
    })

    logger.warn('Application will continue despite seeding failure', {
      context: 'DatabaseSeeds'
    })
  }
}

export async function verifyDatabaseSeeds(): Promise<boolean> {
  const logger = AppLoggerInstance

  logger.info('Verifying database seeds', {
    context: 'DatabaseSeeds'
  })

  try {
    const permissionsValid = await permissionSeeder.verifyPermissions()
    await notificationTemplateSeeder.verifyNotificationTemplates()
    const professionalsValid = await professionalSeeder.verifyProfessionals()
    const customersValid = await customerSeeder.verifyCustomers()
    const servicesValid = await serviceSeeder.verifyServices()
    const offersValid = await offerSeeder.verifyOffers()
    await shiftSeeder.verifyShifts()
    await appointmentSeeder.verifyAppointments()
    await ratingSeeder.verifyRatings()
    await notificationSeeder.verifyNotifications()

    const allValid = permissionsValid && professionalsValid && customersValid && servicesValid && offersValid

    if (allValid) {
      logger.info('All database seeds verified successfully', {
        context: 'DatabaseSeeds'
      })
      return true
    } else {
      logger.warn('Some database seeds are missing or invalid', {
        context: 'DatabaseSeeds',
        permissionsValid,
        professionalsValid,
        customersValid,
        servicesValid,
        offersValid
      })
      return false
    }
  } catch (error) {
    const errorDetails = error instanceof Error ? error : undefined

    logger.error('Failed to verify database seeds', errorDetails, {
      context: 'DatabaseSeeds'
    })
    return false
  }
}
