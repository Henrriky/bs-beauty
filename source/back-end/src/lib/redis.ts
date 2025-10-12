import { ENV } from '@/config/env'
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

redis.on('connect', () => { console.log('[redis] connecting...') })
redis.on('ready', () => { console.log('[redis] ready') })
redis.on('error', (err) => { console.error('[redis] error:', err?.message ?? err) })
redis.on('end', () => { console.warn('[redis] connection closed') })

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
    console.log(`[redis] received ${signal}, closing connection...`)
    await closeRedis()
    process.exit(0)
  })
}
