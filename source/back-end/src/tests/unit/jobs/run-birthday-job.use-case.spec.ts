import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RunBirthdayJobUseCase } from '@/jobs/run-birthday-job.use-case'
import { faker } from '@faker-js/faker'
import { NotificationChannel } from '@prisma/client'
import { notificationBus } from '@/events/notification-bus'

vi.mock('@/events/notification-bus', () => ({
  notificationBus: {
    emit: vi.fn()
  }
}))

describe('RunBirthdayJobUseCase', () => {
  let useCase: RunBirthdayJobUseCase
  let mockCustomerRepo: any
  let mockTemplateRepo: any

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.COMPANY_NAME = 'BS BEAUTY'

    mockCustomerRepo = {
      findBirthdayCustomersOnCurrentDate: vi.fn()
    }

    mockTemplateRepo = {
      findActiveByKey: vi.fn()
    }

    useCase = new RunBirthdayJobUseCase(mockCustomerRepo, mockTemplateRepo)
  })

  describe('execute', () => {
    it('should process birthday notifications for customers', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}! 🎉',
        body: 'Oi, {nome}! Hoje você completa {idade} anos. A {empresa} deseja um dia incrível!'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.totalFound).toBe(1)
      expect(result.enqueued).toBe(1)
      expect(result.skippedPreferenceNone).toBe(0)
      expect(result.errors).toBe(0)
      expect(result.tz).toBe('America/Sao_Paulo')

      expect(notificationBus.emit).toHaveBeenCalledWith('birthday.notify', {
        payload: expect.objectContaining({
          recipientId: mockCustomers[0].id,
          recipientType: 'CUSTOMER',
          notificationPreference: NotificationChannel.IN_APP,
          email: 'john@example.com',
          templateKey: 'BIRTHDAY',
          year: 2025
        })
      })
    })

    it('should skip customers with NONE notification preference', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.NONE
        },
        {
          id: faker.string.uuid(),
          name: 'Jane Doe',
          email: 'jane@example.com',
          birthdate,
          notificationPreference: NotificationChannel.ALL
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}! 🎉',
        body: 'Oi, {nome}! Hoje você completa {idade} anos.'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.totalFound).toBe(2)
      expect(result.enqueued).toBe(1)
      expect(result.skippedPreferenceNone).toBe(1)
      expect(result.errors).toBe(0)
    })

    it('should use fallback template when template not found', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(null)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.enqueued).toBe(1)
      expect(notificationBus.emit).toHaveBeenCalledWith('birthday.notify', {
        payload: expect.objectContaining({
          title: expect.stringContaining('Feliz aniversário'),
          message: expect.stringContaining('John Doe')
        })
      })
    })

    it('should run in dry run mode without emitting events', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}!',
        body: 'Teste'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: true
      })

      expect(result.totalFound).toBe(1)
      expect(result.enqueued).toBe(0)
      expect(notificationBus.emit).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully and count them', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        },
        {
          id: faker.string.uuid(),
          name: 'Jane Doe',
          email: 'jane@example.com',
          birthdate, // Valid birthdate but will fail on emit
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}!',
        body: 'Teste'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      // Make the second emit throw an error
      let emitCallCount = 0
      vi.mocked(notificationBus.emit).mockImplementation(() => {
        emitCallCount++
        if (emitCallCount === 2) {
          throw new Error('Emit failed')
        }
        return true
      })

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.totalFound).toBe(2)
      expect(result.errors).toBeGreaterThan(0)
      expect(result.enqueued).toBe(1) // Only first one succeeded
    })

    it('should calculate correct age for customers', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}!',
        body: 'Você completa {idade} anos!'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.enqueued).toBe(1)
      expect(notificationBus.emit).toHaveBeenCalledWith('birthday.notify', {
        payload: expect.objectContaining({
          message: expect.stringContaining('35 anos') // 2025 - 1990 = 35
        })
      })
    })

    it('should handle customers with null notification preference as NONE', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: null
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário, {nome}!',
        body: 'Teste'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.skippedPreferenceNone).toBe(1)
      expect(result.enqueued).toBe(0)
    })

    it('should use current date when runDate is not provided', async () => {
      const mockCustomers: any[] = []

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue({
        title: 'Test',
        body: 'Test'
      })

      const result = await useCase.execute({
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.totalFound).toBe(0)
      expect(mockCustomerRepo.findBirthdayCustomersOnCurrentDate).toHaveBeenCalled()
    })

    it('should handle empty customer list', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue([])
      mockTemplateRepo.findActiveByKey.mockResolvedValue({
        title: 'Test',
        body: 'Test'
      })

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.totalFound).toBe(0)
      expect(result.enqueued).toBe(0)
      expect(result.skippedPreferenceNone).toBe(0)
      expect(result.errors).toBe(0)
    })

    it('should sanitize rendered message by removing excess whitespace', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const mockCustomers = [
        {
          id: faker.string.uuid(),
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário!',
        body: 'Oi, {nome}!   \n\n\n\nTeste   '
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      const result = await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(result.enqueued).toBe(1)
      expect(notificationBus.emit).toHaveBeenCalledWith('birthday.notify', {
        payload: expect.objectContaining({
          message: expect.not.stringContaining('   ')
        })
      })
    })

    it('should generate unique marker for each notification', async () => {
      const today = new Date('2025-11-09T10:00:00.000Z')
      const birthdate = new Date('1990-11-09')

      const customerId = faker.string.uuid()
      const mockCustomers = [
        {
          id: customerId,
          name: 'John Doe',
          email: 'john@example.com',
          birthdate,
          notificationPreference: NotificationChannel.IN_APP
        }
      ]

      const mockTemplate = {
        title: 'Feliz aniversário!',
        body: 'Teste'
      }

      mockCustomerRepo.findBirthdayCustomersOnCurrentDate.mockResolvedValue(mockCustomers)
      mockTemplateRepo.findActiveByKey.mockResolvedValue(mockTemplate)

      await useCase.execute({
        runDate: today,
        timezone: 'America/Sao_Paulo',
        dryRun: false
      })

      expect(notificationBus.emit).toHaveBeenCalledWith('birthday.notify', {
        payload: expect.objectContaining({
          marker: `birthday:${customerId}:2025`
        })
      })
    })
  })
})
