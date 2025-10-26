import { app } from './app'
import { drainAndExit } from './events/notification-runner'
import { registerNotificationListeners } from './events/notifications.listener'
import { runDatabaseSeeds } from '../prisma/seeds/database-seeds.runner'
import { AppLoggerInstance } from './utils/logger/logger.util'
import { registerCronJobs } from './jobs/register-cron-jobs'

const port = process.env.PORT ?? 3000

async function startServer(): Promise<void> {
  try {
    await runDatabaseSeeds()
    registerNotificationListeners()
    registerCronJobs()

    app.listen(port, () => {
      AppLoggerInstance.info(`HTTP Server listening on port ${port}`)
    })
    process.on('SIGTERM', async () => {
      AppLoggerInstance.info(`HTTP Server Shutting down, draining notification queue...`)
      await drainAndExit()
      process.exit(0)
    })
  } catch (error) {
    AppLoggerInstance.error('Failed to start server:', error as Error)
    process.exit(1)
  }
}

startServer()
  .catch((error) => AppLoggerInstance.error('Error trying to starting http server', error))