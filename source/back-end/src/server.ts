import { app } from './app'
import { drainAndExit } from './events/notification-runner'
import { registerNotificationListeners } from './events/notifications.listener'
import { makeRunBirthdayJobUseCase } from './factory/notifications-birthday.factory'
import { Scheduler } from './utils/scheduler'
import { runDatabaseSeeds } from '../prisma/seeds/database-seeds.runner'
import { AppLoggerInstance } from './utils/logger/logger.util'

const port = process.env.PORT ?? 3000
registerNotificationListeners()

Scheduler.register('birthday-job', process.env.BIRTHDAY_CRON_SCHEDULE || '*/30 * * * * *', 'America/Sao_Paulo', async () => {
  const usecase = makeRunBirthdayJobUseCase()
  await usecase.execute({
    timezone: 'America/Sao_Paulo',
    dryRun: false,
  })
})

async function startServer(): Promise<void> {
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

app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down, draining notification queue...')
  await drainAndExit()
  process.exit(0)
})
