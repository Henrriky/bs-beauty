import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { enqueue, drainAndExit } from '@/events/notification-runner'

describe('notification-runner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('enqueue', () => {
    it('should enqueue and execute a job successfully', async () => {
      const jobMock = vi.fn().mockResolvedValue(undefined)

      enqueue(jobMock)

      // Wait for the job to be picked up
      await vi.runAllTimersAsync()

      expect(jobMock).toHaveBeenCalledTimes(1)
    })

    it('should execute multiple jobs', async () => {
      const job1 = vi.fn().mockResolvedValue(undefined)
      const job2 = vi.fn().mockResolvedValue(undefined)
      const job3 = vi.fn().mockResolvedValue(undefined)

      enqueue(job1)
      enqueue(job2)
      enqueue(job3)

      await vi.runAllTimersAsync()

      expect(job1).toHaveBeenCalledTimes(1)
      expect(job2).toHaveBeenCalledTimes(1)
      expect(job3).toHaveBeenCalledTimes(1)
    })

    it('should retry failed jobs after delay', async () => {
      const error = new Error('Job failed')
      const jobMock = vi.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined)

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      enqueue(jobMock)

      // First execution (fails) - job is called immediately and then retried
      await vi.runAllTimersAsync()

      // Wait for retry delay
      await vi.advanceTimersByTimeAsync(2000)
      await vi.runAllTimersAsync()

      // Should be called twice: initial call + retry
      expect(jobMock).toHaveBeenCalledTimes(2)
      expect(consoleErrorSpy).toHaveBeenCalledWith('[notify] job failed:', 'Job failed')

      consoleErrorSpy.mockRestore()
    })

    it('should handle job with error object without message', async () => {
      const jobMock = vi.fn()
        .mockRejectedValueOnce({ code: 'SOME_ERROR' })
        .mockResolvedValueOnce(undefined) // Resolve on retry
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      enqueue(jobMock)

      // First execution (fails)
      await vi.runAllTimersAsync()
      expect(consoleErrorSpy).toHaveBeenCalledWith('[notify] job failed:', { code: 'SOME_ERROR' })

      // Wait for retry and execute again (succeeds)
      await vi.advanceTimersByTimeAsync(2000)
      await vi.runAllTimersAsync()

      consoleErrorSpy.mockRestore()
    })

    it('should handle job execution concurrently', async () => {
      let job1Started = false
      let job2Started = false
      let job3Started = false

      const job1 = vi.fn(async () => {
        job1Started = true
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      const job2 = vi.fn(async () => {
        job2Started = true
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      const job3 = vi.fn(async () => {
        job3Started = true
        await new Promise(resolve => setTimeout(resolve, 100))
      })

      enqueue(job1)
      enqueue(job2)
      enqueue(job3)

      await vi.runAllTimersAsync()

      expect(job1).toHaveBeenCalled()
      expect(job2).toHaveBeenCalled()
      expect(job3).toHaveBeenCalled()
    })
  })

  describe('drainAndExit', () => {
    it('should wait for all jobs to complete before resolving', async () => {
      const job1 = vi.fn().mockResolvedValue(undefined)
      const job2 = vi.fn().mockResolvedValue(undefined)

      enqueue(job1)
      enqueue(job2)

      const drainPromise = drainAndExit()

      await vi.runAllTimersAsync()

      await expect(drainPromise).resolves.toBeUndefined()
      expect(job1).toHaveBeenCalled()
      expect(job2).toHaveBeenCalled()
    })

    it('should resolve immediately if queue is empty', async () => {
      const drainPromise = drainAndExit()

      await vi.runAllTimersAsync()

      await expect(drainPromise).resolves.toBeUndefined()
    })

    it('should wait for running jobs even if queue is empty', async () => {
      const slowJob = vi.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
      })

      enqueue(slowJob)

      // Start draining after job starts
      await vi.advanceTimersByTimeAsync(10)
      const drainPromise = drainAndExit()

      await vi.runAllTimersAsync()

      await expect(drainPromise).resolves.toBeUndefined()
      expect(slowJob).toHaveBeenCalled()
    })
  })

  describe('queue management', () => {
    it('should process jobs in FIFO order', async () => {
      const executionOrder: number[] = []

      const job1 = vi.fn(async () => { executionOrder.push(1) })
      const job2 = vi.fn(async () => { executionOrder.push(2) })
      const job3 = vi.fn(async () => { executionOrder.push(3) })

      enqueue(job1)
      enqueue(job2)
      enqueue(job3)

      await vi.runAllTimersAsync()

      expect(executionOrder).toEqual([1, 2, 3])
    })

    it('should respect concurrency limit', async () => {
      const concurrentJobs: number[] = []
      let currentConcurrent = 0
      let maxConcurrent = 0

      const createJob = (id: number) => vi.fn(async () => {
        currentConcurrent++
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent)
        concurrentJobs.push(id)
        await new Promise(resolve => setTimeout(resolve, 50))
        currentConcurrent--
      })

      // Enqueue more than concurrency limit
      const jobs = Array.from({ length: 10 }, (_, i) => createJob(i + 1))
      jobs.forEach(job => { enqueue(job) })

      await vi.runAllTimersAsync()

      // Should respect CONCURRENCY limit (default is 3 based on env)
      expect(maxConcurrent).toBeLessThanOrEqual(3)
      expect(concurrentJobs.length).toBe(10)
    })
  })
})
