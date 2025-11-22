import { AppLoggerInstance } from '../../src/utils/logger/logger.util'

export interface SeederConfig<TData, TModel> {
  entityName: string
  context: string
  getData: () => TData[]
  findExisting: (data: TData) => Promise<TModel | null>
  createEntity: (data: TData) => Promise<TModel>
  updateEntity: (existing: TModel, data: TData) => Promise<TModel>
  getIdentifier: (data: TData) => string
}

export interface SeederResult {
  createdCount: number
  existingCount: number
  updatedCount: number
  totalProcessed: number
}

export abstract class BaseSeederService<TData, TModel> {
  protected readonly logger = AppLoggerInstance

  constructor(protected readonly config: SeederConfig<TData, TModel>) { }

  async seed(): Promise<void> {
    this.logger.info(`Starting ${this.config.entityName} seeding process`, {
      context: this.config.context
    })

    try {
      const dataToSeed = this.config.getData()

      this.logger.info(`Found ${dataToSeed.length} ${this.config.entityName} to process`, {
        context: this.config.context,
        count: dataToSeed.length
      })

      const result: SeederResult = {
        createdCount: 0,
        existingCount: 0,
        updatedCount: 0,
        totalProcessed: dataToSeed.length
      }

      for (const data of dataToSeed) {
        const existing = await this.config.findExisting(data)

        if (!existing) {
          await this.config.createEntity(data)
          result.createdCount++

          this.logger.info(`Created ${this.config.entityName}: ${this.config.getIdentifier(data)}`, {
            context: this.config.context
          })
        } else {
          await this.config.updateEntity(existing, data)
          result.updatedCount++
          result.existingCount++

          this.logger.info(`Updated existing ${this.config.entityName}: ${this.config.getIdentifier(data)}`, {
            context: this.config.context
          })
        }
      }

      this.logger.info(`${this.config.entityName} seeding completed successfully`, {
        context: this.config.context,
        ...result
      })
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error(`Failed to seed ${this.config.entityName}`, errorDetails, {
        context: this.config.context
      })
      throw error
    }
  }

  protected async verifyEntities<TPartial = TModel>(
    getExpectedData: () => TData[],
    findExistingEntities: (data: TData[]) => Promise<TPartial[]>,
    extractIdentifier: (model: TPartial) => string,
    dataIdentifier: (data: TData) => string
  ): Promise<boolean> {
    try {
      const expectedData = getExpectedData()
      const existingEntities = await findExistingEntities(expectedData)

      const existingIdentifiers = new Set(existingEntities.map(extractIdentifier))
      const missingEntities = expectedData.filter(
        (data) => !existingIdentifiers.has(dataIdentifier(data))
      )

      if (missingEntities.length > 0) {
        this.logger.warn(`Missing ${this.config.entityName} found in database`, {
          context: this.config.context,
          missingCount: missingEntities.length,
          missing: missingEntities.map(dataIdentifier)
        })
        return false
      }

      this.logger.info(`All ${this.config.entityName} verified - database is up to date`, {
        context: this.config.context,
        total: expectedData.length
      })
      return true
    } catch (error) {
      const errorDetails = error instanceof Error ? error : undefined

      this.logger.error(`Failed to verify ${this.config.entityName}`, errorDetails, {
        context: this.config.context
      })
      return false
    }
  }
}
