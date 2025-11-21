import { AppLoggerInstance } from '../../src/utils/logger/logger.util'

export interface RelationSeederResult {
  createdCount: number
  skippedCount?: number
  updatedCount?: number
}

export abstract class BaseRelationSeederService {
  protected readonly logger = AppLoggerInstance

  protected logSeedingStart(entityName: string): void {
    this.logger.info(`[${entityName.toUpperCase()} SEED] Starting ${entityName} seeding...`)
  }

  protected logSeedingComplete(entityName: string, result: RelationSeederResult): void {
    const parts = [`${result.createdCount} created`]
    if (result.skippedCount !== undefined) {
      parts.push(`${result.skippedCount} skipped`)
    }
    if (result.updatedCount !== undefined) {
      parts.push(`${result.updatedCount} updated`)
    }

    this.logger.info(
      `[${entityName.toUpperCase()} SEED] ${entityName} seeding completed: ${parts.join(', ')}`
    )
  }

  protected logWarning(entityName: string, message: string): void {
    this.logger.warn(`[${entityName.toUpperCase()} SEED] ${message}`)
  }

  protected logInfo(entityName: string, message: string): void {
    this.logger.info(`[${entityName.toUpperCase()} SEED] ${message}`)
  }

  protected logVerificationStart(entityName: string): void {
    this.logger.info(`[${entityName.toUpperCase()} SEED] Verifying ${entityName}...`)
  }

  protected logVerificationComplete(entityName: string): void {
    this.logger.info(`[${entityName.toUpperCase()} SEED] ${entityName} verification completed`)
  }
}
