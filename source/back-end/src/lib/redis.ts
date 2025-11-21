import { ENV } from '@/config/env'
import { AppLoggerInstance } from '@/utils/logger/logger.util'
import Redis, { type RedisOptions } from 'ioredis'

function buildRedisOptions (): string | RedisOptions {
  const options: RedisOptions = {
    host: ENV.REDIS_HOST,
    port: ENV.REDIS_PORT,
    password: ENV.REDIS_PASSWORD,
    tls: undefined,

    retryStrategy (times) {
      const delay = Math.min(times * 200, 2000)
      return delay
    },

    reconnectOnError (err) {
      const msg = err?.message ?? ''
      if (/READONLY|MOVED|CLUSTERDOWN|CONNECTION_BROKEN/i.test(msg)) return true
      return false
    }
  }
  return options
}

export const redis = new Redis(buildRedisOptions() as any)

redis.on('connect', () => { AppLoggerInstance.info('[Redis] Connected') })
redis.on('ready', () => { AppLoggerInstance.info('[Redis] Ready to use') })
redis.on('error', (err) => { AppLoggerInstance.error('[Redis] Error occurred', err) })
redis.on('end', () => { AppLoggerInstance.info('[Redis] Connection closed') })

export async function closeRedis (): Promise<void> {
  try {
    await redis.quit()
  } catch {
    try { redis.disconnect() } catch { }
  }
}

const shutdownSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
for (const signal of shutdownSignals) {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on(signal, async () => {
    AppLoggerInstance.info(`[Redis] received shutdown signal: ${signal}`)
    await closeRedis()
    process.exit(0)
  })
}
