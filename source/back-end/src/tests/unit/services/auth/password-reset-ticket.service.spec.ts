import { PasswordResetTicketService } from '@/services/use-cases/auth/services/password-reset-ticket.service'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { MockCache } from '../../utils/mocks/services'
import crypto from 'crypto'

vi.mock('crypto', () => ({
  default: {
    randomUUID: vi.fn()
  }
}))

describe('PasswordResetTicketService', () => {
  let passwordResetTicketService: PasswordResetTicketService

  const mockTicketId = '550e8400-e29b-41d4-a716-446655440000'
  const mockPayload = {
    email: faker.internet.email(),
    userId: faker.string.uuid()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    passwordResetTicketService = new PasswordResetTicketService(MockCache)

    vi.mocked(crypto.randomUUID).mockReturnValue(mockTicketId)
  })

  it('should be defined', () => {
    expect(PasswordResetTicketService).toBeDefined()
  })

  describe('create', () => {
    it('should create ticket successfully with default TTL', async () => {
      // arrange
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)

      // act
      const result = await passwordResetTicketService.create(mockPayload)

      // assert
      expect(result).toBe(mockTicketId)
      expect(crypto.randomUUID).toHaveBeenCalled()
      expect(MockCache.set).toHaveBeenCalledWith(
        `passwordReset:ticket:${mockTicketId}`,
        mockPayload,
        { timeToLiveSeconds: 15 * 60 }
      )
    })

    it('should create ticket successfully with custom TTL', async () => {
      // arrange
      const customTtl = 30 * 60
      vi.mocked(MockCache.set).mockResolvedValueOnce(true)

      // act
      const result = await passwordResetTicketService.create(mockPayload, customTtl)

      // assert
      expect(result).toBe(mockTicketId)
      expect(MockCache.set).toHaveBeenCalledWith(
        `passwordReset:ticket:${mockTicketId}`,
        mockPayload,
        { timeToLiveSeconds: customTtl }
      )
    })

    it('should propagate cache errors when setting ticket', async () => {
      // arrange
      const cacheError = new Error('Redis connection failed')
      vi.mocked(MockCache.set).mockRejectedValueOnce(cacheError)

      // act & assert
      await expect(
        passwordResetTicketService.create(mockPayload)
      ).rejects.toThrow('Redis connection failed')
    })
  })

  describe('consume', () => {
    it('should consume ticket successfully and return payload', async () => {
      // arrange
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPayload)
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act
      const result = await passwordResetTicketService.consume(mockTicketId)

      // assert
      expect(result).toEqual(mockPayload)
      expect(MockCache.get).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
      expect(MockCache.delete).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
    })

    it('should return null when ticket does not exist', async () => {
      // arrange
      vi.mocked(MockCache.get).mockResolvedValueOnce(null)

      // act
      const result = await passwordResetTicketService.consume('non-existent-ticket')

      // assert
      expect(result).toBeNull()
      expect(MockCache.get).toHaveBeenCalledWith('passwordReset:ticket:non-existent-ticket')
      expect(MockCache.delete).not.toHaveBeenCalled()
    })

    it('should return null when ticket is expired', async () => {
      // arrange
      vi.mocked(MockCache.get).mockResolvedValueOnce(undefined)

      // act
      const result = await passwordResetTicketService.consume(mockTicketId)

      // assert
      expect(result).toBeNull()
      expect(MockCache.delete).not.toHaveBeenCalled()
    })

    it('should delete ticket after successful retrieval', async () => {
      // arrange
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPayload)
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act
      await passwordResetTicketService.consume(mockTicketId)

      // assert
      expect(MockCache.delete).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
    })

    it('should propagate cache errors when getting ticket', async () => {
      // arrange
      const cacheError = new Error('Redis get operation failed')
      vi.mocked(MockCache.get).mockRejectedValueOnce(cacheError)

      // act & assert
      await expect(
        passwordResetTicketService.consume(mockTicketId)
      ).rejects.toThrow('Redis get operation failed')

      expect(MockCache.delete).not.toHaveBeenCalled()
    })

    it('should propagate cache errors when deleting ticket', async () => {
      // arrange
      const deleteError = new Error('Redis delete operation failed')
      vi.mocked(MockCache.get).mockResolvedValueOnce(mockPayload)
      vi.mocked(MockCache.delete).mockRejectedValueOnce(deleteError)

      // act & assert
      await expect(
        passwordResetTicketService.consume(mockTicketId)
      ).rejects.toThrow('Redis delete operation failed')

      expect(MockCache.get).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
      expect(MockCache.delete).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
    })
  })

  describe('integration scenarios', () => {
    it('should handle create and consume flow correctly', async () => {
      // arrange
      const testPayload = {
        email: 'integration@test.com',
        userId: '550e8400-e29b-41d4-a716-446655440005'
      }

      vi.mocked(MockCache.set).mockResolvedValueOnce(true)
      vi.mocked(MockCache.get).mockResolvedValueOnce(testPayload)
      vi.mocked(MockCache.delete).mockResolvedValueOnce(undefined)

      // act - create ticket
      const ticketId = await passwordResetTicketService.create(testPayload, 600)

      // act - consume ticket
      const retrievedPayload = await passwordResetTicketService.consume(ticketId)

      // assert
      expect(ticketId).toBe(mockTicketId)
      expect(retrievedPayload).toEqual(testPayload)

      expect(MockCache.set).toHaveBeenCalledWith(
        `passwordReset:ticket:${mockTicketId}`,
        testPayload,
        { timeToLiveSeconds: 600 }
      )
      expect(MockCache.get).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
      expect(MockCache.delete).toHaveBeenCalledWith(`passwordReset:ticket:${mockTicketId}`)
    })

    it('should handle ticket consumed twice (second attempt returns null)', async () => {
      // arrange
      vi.mocked(MockCache.get)
        .mockResolvedValueOnce(mockPayload) // First consume - success
        .mockResolvedValueOnce(null) // Second consume - already deleted
      vi.mocked(MockCache.delete).mockResolvedValue(undefined)

      // act
      const firstConsume = await passwordResetTicketService.consume(mockTicketId)
      const secondConsume = await passwordResetTicketService.consume(mockTicketId)

      // assert
      expect(firstConsume).toEqual(mockPayload)
      expect(secondConsume).toBeNull()
      expect(MockCache.delete).toHaveBeenCalledTimes(1) // Only deleted once
    })
  })
})
