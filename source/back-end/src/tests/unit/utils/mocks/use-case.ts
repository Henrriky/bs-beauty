import { type BlockedTimesUseCase } from '@/services/blocked-times.use-case'
import { type Mocked } from 'vitest'

const MockBlockedTimesUseCase = {
  executeCreate: vi.fn(),
  executeDelete: vi.fn(),
  executeUpdate: vi.fn(),
  executeFindAllPaginated: vi.fn(),
  executeFindById: vi.fn(),
  executeFindByProfessionalAndPeriod: vi.fn()
} as unknown as Mocked<BlockedTimesUseCase>

export { MockBlockedTimesUseCase }
