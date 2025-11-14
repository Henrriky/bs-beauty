import { AppLoggerInstance } from '@/utils/logger/logger.util'
import { permissionSeeder } from './permission-seeder.service'

export async function runDatabaseSeeds (): Promise<void> {
  const logger = AppLoggerInstance

  logger.info('Starting database seeding process', {
    context: 'DatabaseSeeds'
  })

  try {
    await permissionSeeder.seedPermissions()

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

export async function verifyDatabaseSeeds (): Promise<boolean> {
  const logger = AppLoggerInstance

  logger.info('Verifying database seeds', {
    context: 'DatabaseSeeds'
  })

  try {
    const permissionsValid = await permissionSeeder.verifyPermissions()

    if (permissionsValid) {
      logger.info('All database seeds verified successfully', {
        context: 'DatabaseSeeds'
      })
      return true
    } else {
      logger.warn('Some database seeds are missing or invalid', {
        context: 'DatabaseSeeds'
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
