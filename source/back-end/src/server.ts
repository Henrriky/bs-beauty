import { app } from './app'
import { drainAndExit } from './events/notification-runner'
import { registerNotificationListeners } from './events/notifications.listener'
import { makeRunBirthdayJobUseCase } from './factory/notifications-birthday.factory'
import { Scheduler } from './utils/scheduler'

const port = process.env.PORT ?? 3000

registerNotificationListeners()

Scheduler.register('birthday-job', '*/5 * * * * *', 'America/Sao_Paulo', async () => {
  const usecase = makeRunBirthdayJobUseCase()
  await usecase.execute({
    timezone: 'America/Sao_Paulo',
    dryRun: false,
  })
})

app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down, draining notification queue...')
  await drainAndExit()
  process.exit(0)
})