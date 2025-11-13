import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RedisCacheProvider } from '@/services/cache/redis-cache-provider.service'
import { redis } from '@/lib/redis'

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    incr: vi.fn(),
    ttl: vi.fn(),
    eval: vi.fn()
  }
}))

describe('RedisCacheProvider', () => {
  let redisCacheProvider: RedisCacheProvider

  beforeEach(() => {
    redisCacheProvider = new RedisCacheProvider()
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should return parsed value when key exists', async () => {
      const mockValue = { id: 1, name: 'test' }
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockValue))

      const result = await redisCacheProvider.get('test-key')

      expect(result).toEqual(mockValue)
      expect(redis.get).toHaveBeenCalledWith('test-key')
    })

    it('should return null when key does not exist', async () => {
      vi.mocked(redis.get).mockResolvedValue(null)

      const result = await redisCacheProvider.get('non-existent-key')

      expect(result).toBeNull()
      expect(redis.get).toHaveBeenCalledWith('non-existent-key')
    })

    it('should handle complex objects', async () => {
      const mockValue = {
        user: { id: 1, name: 'John' },
        permissions: ['read', 'write'],
        active: true
      }
      vi.mocked(redis.get).mockResolvedValue(JSON.stringify(mockValue))

      const result = await redisCacheProvider.get<typeof mockValue>('complex-key')

      expect(result).toEqual(mockValue)
    })
  })

  describe('set', () => {
    it('should set value without expiration', async () => {
      const mockValue = { data: 'test' }
      vi.mocked(redis.set).mockResolvedValue('OK')

      const result = await redisCacheProvider.set('test-key', mockValue)

      expect(result).toBe(true)
      expect(redis.set).toHaveBeenCalledWith('test-key', JSON.stringify(mockValue))
    })

    it('should set value with expiration time', async () => {
      const mockValue = { data: 'test' }
      vi.mocked(redis.set).mockResolvedValue('OK')

      const result = await redisCacheProvider.set('test-key', mockValue, {
        timeToLiveSeconds: 3600
      })

      expect(result).toBe(true)
      expect(redis.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(mockValue),
        'EX',
        3600
      )
    })

    it('should set value only if not exists (NX)', async () => {
      const mockValue = { data: 'test' }
      vi.mocked(redis.set).mockResolvedValue('OK')

      const result = await redisCacheProvider.set('test-key', mockValue, {
        onlyIfNotExists: true
      })

      expect(result).toBe(true)
      expect(redis.set).toHaveBeenCalledWith('test-key', JSON.stringify(mockValue), 'NX')
    })

    it('should return false when NX fails (key already exists)', async () => {
      const mockValue = { data: 'test' }
      vi.mocked(redis.set).mockResolvedValue(null)

      const result = await redisCacheProvider.set('test-key', mockValue, {
        onlyIfNotExists: true
      })

      expect(result).toBe(false)
    })

    it('should set value with NX and expiration', async () => {
      const mockValue = { data: 'test' }
      vi.mocked(redis.set).mockResolvedValue('OK')

      const result = await redisCacheProvider.set('test-key', mockValue, {
        onlyIfNotExists: true,
        timeToLiveSeconds: 1800
      })

      expect(result).toBe(true)
      expect(redis.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(mockValue),
        'NX',
        'EX',
        1800
      )
    })
  })

  describe('delete', () => {
    it('should delete a key', async () => {
      vi.mocked(redis.del).mockResolvedValue(1)

      await redisCacheProvider.delete('test-key')

      expect(redis.del).toHaveBeenCalledWith('test-key')
    })
  })

  describe('incr', () => {
    it('should increment a key and return new value', async () => {
      vi.mocked(redis.incr).mockResolvedValue(5)

      const result = await redisCacheProvider.incr('counter-key')

      expect(result).toBe(5)
      expect(redis.incr).toHaveBeenCalledWith('counter-key')
    })
  })

  describe('ttl', () => {
    it('should return TTL in seconds when key has expiration', async () => {
      vi.mocked(redis.ttl).mockResolvedValue(3600)

      const result = await redisCacheProvider.ttl('test-key')

      expect(result).toBe(3600)
      expect(redis.ttl).toHaveBeenCalledWith('test-key')
    })

    it('should return null when key has no expiration or does not exist', async () => {
      vi.mocked(redis.ttl).mockResolvedValue(-1)

      const result = await redisCacheProvider.ttl('test-key')

      expect(result).toBeNull()
    })

    it('should return null when TTL is -2 (key does not exist)', async () => {
      vi.mocked(redis.ttl).mockResolvedValue(-2)

      const result = await redisCacheProvider.ttl('non-existent-key')

      expect(result).toBeNull()
    })
  })

  describe('withLock', () => {
    it('should acquire lock, execute task, and release lock', async () => {
      vi.mocked(redis.set).mockResolvedValue('OK')
      vi.mocked(redis.eval).mockResolvedValue(1)

      const task = vi.fn().mockResolvedValue('task-result')

      const result = await redisCacheProvider.withLock(
        'lock-key',
        10,
        task
      )

      expect(result).toBe('task-result')
      expect(task).toHaveBeenCalledOnce()
      expect(redis.set).toHaveBeenCalledWith(
        'lock-key',
        expect.any(String),
        'NX',
        'EX',
        10
      )
      expect(redis.eval).toHaveBeenCalledWith(
        expect.stringContaining('redis.call("GET", KEYS[1])'),
        1,
        'lock-key',
        expect.any(String)
      )
    })

    it('should throw error when lock cannot be acquired', async () => {
      vi.mocked(redis.set).mockResolvedValue(null)

      const task = vi.fn().mockResolvedValue('task-result')

      await expect(
        redisCacheProvider.withLock('lock-key', 10, task)
      ).rejects.toThrow('LOCK_NOT_ACQUIRED')

      expect(task).not.toHaveBeenCalled()
    })

    it('should release lock even if task throws error', async () => {
      vi.mocked(redis.set).mockResolvedValue('OK')
      vi.mocked(redis.eval).mockResolvedValue(1)

      const task = vi.fn().mockRejectedValue(new Error('Task failed'))

      await expect(
        redisCacheProvider.withLock('lock-key', 10, task)
      ).rejects.toThrow('Task failed')

      expect(redis.eval).toHaveBeenCalledWith(
        expect.stringContaining('redis.call("GET", KEYS[1])'),
        1,
        'lock-key',
        expect.any(String)
      )
    })

    it('should execute task successfully with complex return type', async () => {
      vi.mocked(redis.set).mockResolvedValue('OK')
      vi.mocked(redis.eval).mockResolvedValue(1)

      const taskResult = { id: 1, status: 'completed', data: [1, 2, 3] }
      const task = vi.fn().mockResolvedValue(taskResult)

      const result = await redisCacheProvider.withLock('lock-key', 30, task)

      expect(result).toEqual(taskResult)
    })
  })
})
