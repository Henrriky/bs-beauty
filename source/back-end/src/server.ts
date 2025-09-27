import { app } from './app'
import { drainAndExit } from './events/notification-runner'
import { registerNotificationListeners } from './events/notifications.listener'

const port = process.env.PORT ?? 3000

registerNotificationListeners()

app.listen(port, () => {
  console.log(`HTTP Server listening on port ${port}`)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down, draining notification queue...')
  await drainAndExit()
  process.exit(0)
})