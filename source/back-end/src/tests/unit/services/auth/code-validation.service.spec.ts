import { CodeValidationService } from '@/services/use-cases/auth/services/code-validation.service'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { MockCache } from '../../utils/mocks/services'
import crypto from 'crypto'

vi.mock('crypto', () => ({
  default: {
    createHash: vi.fn()
  }
}))

describe('CodeValidationService', () => {
  let codeValidationService: CodeValidationService

  const mockCode = '123456'
  const mockCodeHash = 'mocked-hash-value'
  const mockPayload = {
    userId: faker.string.uuid(),
    email: faker.internet.email()
  }
  const recipientId = faker.internet.email()

  const mockHashFunction = {
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue(mockCodeHash)
  }

  beforeEach(() => {
    vi.clearAllMocks()

    codeValidationService = new CodeValidationService(MockCache)

    vi.mocked(crypto.createHash).mockReturnValue(mockHashFunction as any)
  })

  it('should be defined', () => {
    expect(CodeValidationService).toBeDefined()
  })

  describe('savePendingCode', () => {
    it('should save pending code successfully with default TTL', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)
      const currentTime = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(currentTime)

      // act
      await codeValidationService.savePendingCode({
        purpose: 'register',
        recipientId,
        code: mockCode,
        payload: mockPayload
      })

      // assert
      expect(crypto.createHash).toHaveBeenCalledWith('sha256')
      expect(mockHashFunction.update).toHaveBeenCalledWith(mockCode)
      expect(mockHashFunction.digest).toHaveBeenCalledWith('hex')

      expect(MockCache.set).toHaveBeenCalledWith(
        `code:register:${recipientId.trim().toLowerCase()}`,
        {
          payload: mockPayload,
          verificationCodeHash: mockCodeHash,
          createdAtMillis: currentTime
        },
        { timeToLiveSeconds: 600 }
      )
    })

    it('should save pending code successfully with custom TTL', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)
      const customTtl = 300
      const currentTime = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(currentTime)

      // act
      await codeValidationService.savePendingCode({
        purpose: 'passwordReset',
        recipientId,
        code: mockCode,
        payload: mockPayload,
        timeToLiveSeconds: customTtl
      })

      // assert
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:passwordReset:${recipientId.trim().toLowerCase()}`,
        {
          payload: mockPayload,
          verificationCodeHash: mockCodeHash,
          createdAtMillis: currentTime
        },
        { timeToLiveSeconds: customTtl }
      )
    })

    it('should handle email trimming and lowercase conversion', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)
      const emailWithSpaces = '  TEST@EXAMPLE.COM  '
      const currentTime = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(currentTime)

      // act
      await codeValidationService.savePendingCode({
        purpose: 'register',
        recipientId: emailWithSpaces,
        code: mockCode,
        payload: mockPayload
      })

      // assert
      expect(MockCache.set).toHaveBeenCalledWith(
        'code:register:test@example.com',
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should handle different verification purposes', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValue(true)
      const currentTime = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(currentTime)

      // act
      await codeValidationService.savePendingCode({
        purpose: 'register',
        recipientId,
        code: mockCode,
        payload: mockPayload
      })

      await codeValidationService.savePendingCode({
        purpose: 'passwordReset',
        recipientId,
        code: mockCode,
        payload: mockPayload
      })

      // assert
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:register:${recipientId.trim().toLowerCase()}`,
        expect.any(Object),
        expect.any(Object)
      )
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:passwordReset:${recipientId.trim().toLowerCase()}`,
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('should propagate cache errors', async () => {
      // arrange
      const cacheError = new Error('Redis connection failed')
      vi.mocked(MockCache.set).mockRejectedValueOnce(cacheError)

      // act & assert
      await expect(
        codeValidationService.savePendingCode({
          purpose: 'register',
          recipientId,
          code: mockCode,
          payload: mockPayload
        })
      ).rejects.toThrow('Redis connection failed')
    })
  })

  describe('allowResendAndStartCooldown', () => {
    it('should allow resend and start cooldown with default seconds', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)

      // act
      const result = await codeValidationService.allowResendAndStartCooldown({
        purpose: 'register',
        recipientId
      })

      // assert
      expect(result).toBe(true)
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:register:cooldown:${recipientId.trim().toLowerCase()}`,
        1,
        { onlyIfNotExists: true, timeToLiveSeconds: 60 } // Default 1 minute
      )
    })

    it('should allow resend and start cooldown with custom seconds', async () => {
      // arrange
      const customCooldown = 120 // 2 minutes
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)

      // act
      const result = await codeValidationService.allowResendAndStartCooldown({
        purpose: 'passwordReset',
        recipientId,
        cooldownSeconds: customCooldown
      })

      // assert
      expect(result).toBe(true)
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:passwordReset:cooldown:${recipientId.trim().toLowerCase()}`,
        1,
        { onlyIfNotExists: true, timeToLiveSeconds: customCooldown }
      )
    })

    it('should return false when cooldown already exists', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(false)

      // act
      const result = await codeValidationService.allowResendAndStartCooldown({
        purpose: 'register',
        recipientId
      })

      // assert
      expect(result).toBe(false)
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:register:cooldown:${recipientId.trim().toLowerCase()}`,
        1,
        { onlyIfNotExists: true, timeToLiveSeconds: 60 }
      )
    })

    it('should handle different purposes for cooldown', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValue(true)

      // act
      await codeValidationService.allowResendAndStartCooldown({
        purpose: 'register',
        recipientId
      })

      await codeValidationService.allowResendAndStartCooldown({
        purpose: 'passwordReset',
        recipientId
      })

      // assert
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:register:cooldown:${recipientId.trim().toLowerCase()}`,
        1,
        expect.any(Object)
      )
      expect(MockCache.set).toHaveBeenCalledWith(
        `code:passwordReset:cooldown:${recipientId.trim().toLowerCase()}`,
        1,
        expect.any(Object)
      )
    })

    it('should propagate cache errors', async () => {
      // arrange
      const cacheError = new Error('Redis set operation failed')
      vi.mocked(MockCache.set).mockRejectedValueOnce(cacheError)

      // act & assert
      await expect(
        codeValidationService.allowResendAndStartCooldown({
          purpose: 'register',
          recipientId
        })
      ).rejects.toThrow('Redis set operation failed')
    })
  })

  describe('verifyCodeAndConsume', () => {
    const mockPendingEntry = {
      payload: mockPayload,
      verificationCodeHash: mockCodeHash,
      createdAtMillis: Date.now()
    }

    it('should verify code successfully and return payload', async () => {
      // arrange
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPendingEntry)
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act
      const result = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: mockCode
      })

      // assert
      expect(result).toEqual({
        ok: true,
        payload: mockPayload
      })

      expect(MockCache.withLock).toHaveBeenCalledWith(
        `lock:code:register:${recipientId.trim().toLowerCase()}`,
        5,
        expect.any(Function)
      )
      expect(MockCache.get).toHaveBeenCalledWith(
        `code:register:${recipientId.trim().toLowerCase()}`
      )
      expect(MockCache.delete).toHaveBeenCalledWith(
        `code:register:${recipientId.trim().toLowerCase()}`
      )
    })

    it('should return EXPIRED_OR_NOT_FOUND when no pending entry exists', async () => {
      // arrange
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce(null)

      // act
      const result = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: mockCode
      })

      // assert
      expect(result).toEqual({
        ok: false,
        reason: 'EXPIRED_OR_NOT_FOUND'
      })

      expect(MockCache.delete).not.toHaveBeenCalled()
    })

    it('should return INVALID_CODE when code hash does not match', async () => {
      // arrange
      const differentHash = 'different-hash'
      vi.mocked(crypto.createHash).mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue(differentHash)
      } as any)

      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPendingEntry)

      // act
      const result = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: 'wrong-code'
      })

      // assert
      expect(result).toEqual({
        ok: false,
        reason: 'INVALID_CODE'
      })

      expect(MockCache.delete).not.toHaveBeenCalled()
    })

    it('should handle different verification purposes', async () => {
      // arrange
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValue(mockPendingEntry)
      vi.mocked(MockCache.delete).mockResolvedValue(undefined)

      // act
      await codeValidationService.verifyCodeAndConsume({
        purpose: 'passwordReset',
        recipientId,
        code: mockCode
      })

      // assert
      expect(MockCache.withLock).toHaveBeenCalledWith(
        `lock:code:passwordReset:${recipientId.trim().toLowerCase()}`,
        5,
        expect.any(Function)
      )
      expect(MockCache.get).toHaveBeenCalledWith(
        `code:passwordReset:${recipientId.trim().toLowerCase()}`
      )
    })

    it('should propagate cache errors during get operation', async () => {
      // arrange
      const cacheError = new Error('Redis get operation failed')
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockRejectedValueOnce(cacheError)

      // act & assert
      await expect(
        codeValidationService.verifyCodeAndConsume({
          purpose: 'register',
          recipientId,
          code: mockCode
        })
      ).rejects.toThrow('Redis get operation failed')
    })

    it('should propagate cache errors during delete operation', async () => {
      // arrange
      const deleteError = new Error('Redis delete operation failed')
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPendingEntry)
      vi.mocked(MockCache.delete).mockRejectedValueOnce(deleteError)

      // act & assert
      await expect(
        codeValidationService.verifyCodeAndConsume({
          purpose: 'register',
          recipientId,
          code: mockCode
        })
      ).rejects.toThrow('Redis delete operation failed')
    })

    it('should propagate lock errors', async () => {
      // arrange
      const lockError = new Error('Lock acquisition failed')
      vi.mocked(MockCache.withLock).mockRejectedValueOnce(lockError)

      // act & assert
      await expect(
        codeValidationService.verifyCodeAndConsume({
          purpose: 'register',
          recipientId,
          code: mockCode
        })
      ).rejects.toThrow('Lock acquisition failed')
    })

    it('should use correct lock timeout', async () => {
      // arrange
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        expect(ttl).toBe(5) // 5 seconds lock timeout
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPendingEntry)
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act
      await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: mockCode
      })

      // assert
      expect(MockCache.withLock).toHaveBeenCalledWith(
        expect.any(String),
        5,
        expect.any(Function)
      )
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete flow: save, cooldown, verify', async () => {
      // arrange
      const testCode = '654321'
      const testPayload = { userId: 'test-user-id' }
      const currentTime = Date.now()
      vi.spyOn(Date, 'now').mockReturnValue(currentTime)

      // Mock hash for save operation
      const saveHashMock = {
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue('save-hash')
      }
      vi.mocked(crypto.createHash).mockReturnValueOnce(saveHashMock as any)

      // Mock hash for verify operation
      const verifyHashMock = {
        update: vi.fn().mockReturnThis(),
        digest: vi.fn().mockReturnValue('save-hash') // Same hash for successful verification
      }
      vi.mocked(crypto.createHash).mockReturnValueOnce(verifyHashMock as any)

      vi.mocked(MockCache.set).mockResolvedValue(true)
      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get).mockResolvedValueOnce({
        payload: testPayload,
        verificationCodeHash: 'save-hash',
        createdAtMillis: currentTime
      })
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act - save pending code
      await codeValidationService.savePendingCode({
        purpose: 'register',
        recipientId,
        code: testCode,
        payload: testPayload
      })

      // act - check cooldown
      const cooldownResult = await codeValidationService.allowResendAndStartCooldown({
        purpose: 'register',
        recipientId
      })

      // act - verify code
      const verifyResult = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: testCode
      })

      // assert
      expect(cooldownResult).toBe(true)
      expect(verifyResult).toEqual({
        ok: true,
        payload: testPayload
      })

      expect(MockCache.set).toHaveBeenCalledTimes(2) // save + cooldown
      expect(MockCache.get).toHaveBeenCalledTimes(1)
      expect(MockCache.delete).toHaveBeenCalledTimes(1)
    })

    it('should handle code verification twice (second attempt should fail)', async () => {
      // arrange
      const testPendingEntry = {
        payload: mockPayload,
        verificationCodeHash: mockCodeHash,
        createdAtMillis: Date.now()
      }

      vi.mocked(MockCache.withLock).mockImplementation(async (key, ttl, callback) => {
        return await callback()
      })
      vi.mocked(MockCache.get)
        .mockResolvedValueOnce(testPendingEntry) // First call - success
        .mockResolvedValueOnce(null)              // Second call - already deleted
      vi.mocked(MockCache.delete).mockResolvedValue(undefined)

      // act
      const firstResult = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: mockCode
      })

      const secondResult = await codeValidationService.verifyCodeAndConsume({
        purpose: 'register',
        recipientId,
        code: mockCode
      })

      // assert
      expect(firstResult).toEqual({
        ok: true,
        payload: mockPayload
      })
      expect(secondResult).toEqual({
        ok: false,
        reason: 'EXPIRED_OR_NOT_FOUND'
      })

      expect(MockCache.delete).toHaveBeenCalledTimes(1) // Only deleted once
    })
  })
})