import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerCronJobs } from '@/jobs/register-cron-jobs'
import { Scheduler } from '@/utils/scheduler'
import { makeRunBirthdayJobUseCase } from '@/factory/notifications-birthday.factory'

vi.mock('@/utils/scheduler')
vi.mock('@/factory/notifications-birthday.factory')

describe('registerCronJobs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register birthday job with correct schedule', () => {
    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    expect(mockRegister).toHaveBeenCalledTimes(1)
    expect(mockRegister).toHaveBeenCalledWith(
      'birthday-job',
      expect.any(String), // schedule from env or default
      'America/Sao_Paulo',
      expect.any(Function)
    )
  })

  it('should use default cron schedule when env var is not set', () => {
    const originalEnv = process.env.BIRTHDAY_CRON_SCHEDULE
    delete process.env.BIRTHDAY_CRON_SCHEDULE

    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    expect(mockRegister).toHaveBeenCalledWith(
      'birthday-job',
      '*/30 * * * * *', // default schedule
      'America/Sao_Paulo',
      expect.any(Function)
    )

    // Restore env
    if (originalEnv !== undefined) {
      process.env.BIRTHDAY_CRON_SCHEDULE = originalEnv
    }
  })

  it('should use custom cron schedule from env var', () => {
    const originalEnv = process.env.BIRTHDAY_CRON_SCHEDULE
    process.env.BIRTHDAY_CRON_SCHEDULE = '0 9 * * *' // Daily at 9am

    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    expect(mockRegister).toHaveBeenCalledWith(
      'birthday-job',
      '0 9 * * *',
      'America/Sao_Paulo',
      expect.any(Function)
    )

    // Restore env
    if (originalEnv !== undefined) {
      process.env.BIRTHDAY_CRON_SCHEDULE = originalEnv
    } else {
      delete process.env.BIRTHDAY_CRON_SCHEDULE
    }
  })

  it('should execute birthday job use case when job callback is invoked', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      runDate: new Date().toISOString(),
      tz: 'America/Sao_Paulo',
      totalFound: 5,
      enqueued: 3,
      skippedPreferenceNone: 2,
      errors: 0
    })

    const mockUseCase = {
      execute: mockExecute
    }

    vi.mocked(makeRunBirthdayJobUseCase).mockReturnValue(mockUseCase as any)

    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    // Get the callback function that was registered
    const registeredCallback = mockRegister.mock.calls[0][3]

    // Execute the callback
    await registeredCallback()

    expect(makeRunBirthdayJobUseCase).toHaveBeenCalled()
    expect(mockExecute).toHaveBeenCalledWith({
      timezone: 'America/Sao_Paulo',
      dryRun: false
    })
  })

  it('should use America/Sao_Paulo timezone for the job', () => {
    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    const [, , timezone] = mockRegister.mock.calls[0]
    expect(timezone).toBe('America/Sao_Paulo')
  })

  it('should run in production mode (not dry run)', async () => {
    const mockExecute = vi.fn().mockResolvedValue({
      runDate: new Date().toISOString(),
      tz: 'America/Sao_Paulo',
      totalFound: 0,
      enqueued: 0,
      skippedPreferenceNone: 0,
      errors: 0
    })

    const mockUseCase = {
      execute: mockExecute
    }

    vi.mocked(makeRunBirthdayJobUseCase).mockReturnValue(mockUseCase as any)

    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    const registeredCallback = mockRegister.mock.calls[0][3]
    await registeredCallback()

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        dryRun: false
      })
    )
  })

  it('should handle errors gracefully when job execution fails', async () => {
    const mockExecute = vi.fn().mockRejectedValue(new Error('Job execution failed'))

    const mockUseCase = {
      execute: mockExecute
    }

    vi.mocked(makeRunBirthdayJobUseCase).mockReturnValue(mockUseCase as any)

    const mockRegister = vi.mocked(Scheduler.register)

    registerCronJobs()

    const registeredCallback = mockRegister.mock.calls[0][3]

    // Should not throw - error should be handled by scheduler
    await expect(registeredCallback()).rejects.toThrow('Job execution failed')
  })
})
