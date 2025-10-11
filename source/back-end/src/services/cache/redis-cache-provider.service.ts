import { v4 as uuidV4 } from 'uuid'
import { type Cache } from '../protocols/cache.protocol'
import { redis } from '@/lib/redis'

export class RedisCacheProvider implements Cache {
  async get<T = unknown>(key: string): Promise<T | null> {
    const serializedValue = await redis.get(key)
    return serializedValue ? (JSON.parse(serializedValue) as T) : null
  }

  async set<T = unknown>(
    key: string,
    value: T,
    options?: { timeToLiveSeconds?: number, onlyIfNotExists?: boolean }
  ): Promise<boolean> {
    const serializedValue = JSON.stringify(value)
    const expiryArgs = options?.timeToLiveSeconds ? ['EX', options.timeToLiveSeconds] as const : []

    if (options?.onlyIfNotExists) {
      const setResult = await (redis as any).set(key, serializedValue, 'NX', ...expiryArgs)
      return setResult === 'OK'
    }

    await (redis as any).set(key, serializedValue, ...expiryArgs)
    return true
  }

  async delete (key: string): Promise<void> {
    await redis.del(key)
  }

  async incr (key: string): Promise<number> {
    return await redis.incr(key)
  }

  async ttl (key: string): Promise<number | null> {
    const secondsToLive = await redis.ttl(key)
    return secondsToLive >= 0 ? secondsToLive : null
  }

  async withLock<T>(
    lockKey: string,
    lockTimeToLiveSeconds: number,
    task: () => Promise<T>
  ): Promise<T> {
    const lockToken = uuidV4()
    const lockWasAcquired = await (redis as any).set(lockKey, lockToken, 'NX', 'EX', lockTimeToLiveSeconds)

    if (lockWasAcquired !== 'OK') {
      throw new Error('LOCK_NOT_ACQUIRED')
    }

    try {
      return await task()
    } finally {
      // Liberação segura do lock (confere o token)
      const releaseLockScript = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `
      await redis.eval(releaseLockScript, 1, lockKey, lockToken)
    }
  }
}
