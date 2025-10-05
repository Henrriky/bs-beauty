import { app } from './app'
import { runDatabaseSeeds } from '../prisma/seeds/database-seeds.runner'
import { AppLoggerInstance } from './utils/logger/logger.util'

const port = process.env.PORT ?? 3000

async function startServer (): Promise<void> {
  try {
    await runDatabaseSeeds()

    app.listen(port, () => {
      AppLoggerInstance.info(`HTTP Server listening on port ${port}`)
    })
  } catch (error) {
    AppLoggerInstance.error('Failed to start server:', error as Error)
    process.exit(1)
  }
}

startServer().catch(error => {
  AppLoggerInstance.error('Failed to start server:', error)
  process.exit(1)
})
