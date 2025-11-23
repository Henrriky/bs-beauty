import { SalonInfoUseCase } from '@/services/salon-info.use-case'
import { MockSalonInfoRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { type SalonInfo, type Prisma } from '@prisma/client'

describe('SalonInfoUseCase (Unit Tests)', () => {
  let salonInfoUseCase: SalonInfoUseCase

  beforeEach(() => {
    salonInfoUseCase = new SalonInfoUseCase(MockSalonInfoRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(salonInfoUseCase).toBeDefined()
  })

  describe('executeFetchInfo', () => {
    it('should return salon info by id', async () => {
      const salonInfo: SalonInfo = {
        id: 1,
        name: faker.company.name(),
        openingHours: { monday: '09:00-18:00', tuesday: '09:00-18:00' },
        salonAddress: faker.location.streetAddress(),
        salonEmail: faker.internet.email(),
        salonPhoneNumber: faker.phone.number(),
        minimumAdvanceTime: '24h',
        updatedAt: faker.date.past()
      }

      MockSalonInfoRepository.fetchInfo.mockResolvedValue(salonInfo)

      const result = await salonInfoUseCase.executeFetchInfo(1)

      expect(result).toEqual(salonInfo)
      expect(MockSalonInfoRepository.fetchInfo).toHaveBeenCalledWith(1)
    })

    it('should return null when salon info is not found', async () => {
      MockSalonInfoRepository.fetchInfo.mockResolvedValue(null)

      const result = await salonInfoUseCase.executeFetchInfo(1)

      expect(result).toBeNull()
      expect(MockSalonInfoRepository.fetchInfo).toHaveBeenCalledWith(1)
    })
  })

  describe('executeUpdateInfo', () => {
    it('should update salon info successfully', async () => {
      const salonId = 1
      const updateData: Prisma.SalonInfoUpdateInput = {
        name: 'Updated Salon Name',
        salonAddress: 'Updated address'
      }

      const updatedSalonInfo: SalonInfo = {
        id: salonId,
        name: 'Updated Salon Name',
        openingHours: { monday: '09:00-18:00' },
        salonAddress: 'Updated address',
        salonEmail: faker.internet.email(),
        salonPhoneNumber: faker.phone.number(),
        minimumAdvanceTime: '24h',
        updatedAt: new Date()
      }

      MockSalonInfoRepository.updateInfo.mockResolvedValue(updatedSalonInfo)

      const result = await salonInfoUseCase.executeUpdateInfo(salonId, updateData)

      expect(result).toEqual(updatedSalonInfo)
      expect(MockSalonInfoRepository.updateInfo).toHaveBeenCalledWith(salonId, updateData)
    })

    it('should update only provided fields', async () => {
      const salonId = 1
      const updateData: Prisma.SalonInfoUpdateInput = {
        salonPhoneNumber: '+55 11 98765-4321'
      }

      const existingSalonInfo: SalonInfo = {
        id: salonId,
        name: 'Beauty Salon',
        openingHours: { monday: '09:00-18:00' },
        salonAddress: faker.location.streetAddress(),
        salonEmail: faker.internet.email(),
        salonPhoneNumber: '+55 11 12345-6789',
        minimumAdvanceTime: '24h',
        updatedAt: faker.date.past()
      }

      const updatedSalonInfo: SalonInfo = {
        ...existingSalonInfo,
        salonPhoneNumber: '+55 11 98765-4321',
        updatedAt: new Date()
      }

      MockSalonInfoRepository.updateInfo.mockResolvedValue(updatedSalonInfo)

      const result = await salonInfoUseCase.executeUpdateInfo(salonId, updateData)

      expect(result).toEqual(updatedSalonInfo)
      expect(result.salonPhoneNumber).toBe('+55 11 98765-4321')
      expect(result.name).toBe('Beauty Salon')
      expect(MockSalonInfoRepository.updateInfo).toHaveBeenCalledWith(salonId, updateData)
    })

    it('should update opening hours', async () => {
      const salonId = 1
      const newOpeningHours = {
        monday: '08:00-20:00',
        tuesday: '08:00-20:00',
        wednesday: '08:00-20:00',
        thursday: '08:00-20:00',
        friday: '08:00-20:00',
        saturday: '09:00-17:00',
        sunday: 'Closed'
      }

      const updateData: Prisma.SalonInfoUpdateInput = {
        openingHours: newOpeningHours
      }

      const updatedSalonInfo: SalonInfo = {
        id: salonId,
        name: faker.company.name(),
        openingHours: newOpeningHours,
        salonAddress: faker.location.streetAddress(),
        salonEmail: faker.internet.email(),
        salonPhoneNumber: faker.phone.number(),
        minimumAdvanceTime: '24h',
        updatedAt: new Date()
      }

      MockSalonInfoRepository.updateInfo.mockResolvedValue(updatedSalonInfo)

      const result = await salonInfoUseCase.executeUpdateInfo(salonId, updateData)

      expect(result).toEqual(updatedSalonInfo)
      expect(result.openingHours).toEqual(newOpeningHours)
      expect(MockSalonInfoRepository.updateInfo).toHaveBeenCalledWith(salonId, updateData)
    })

    it('should update minimum advance time', async () => {
      const salonId = 1
      const updateData: Prisma.SalonInfoUpdateInput = {
        minimumAdvanceTime: '48h'
      }

      const updatedSalonInfo: SalonInfo = {
        id: salonId,
        name: faker.company.name(),
        openingHours: { monday: '09:00-18:00' },
        salonAddress: faker.location.streetAddress(),
        salonEmail: faker.internet.email(),
        salonPhoneNumber: faker.phone.number(),
        minimumAdvanceTime: '48h',
        updatedAt: new Date()
      }

      MockSalonInfoRepository.updateInfo.mockResolvedValue(updatedSalonInfo)

      const result = await salonInfoUseCase.executeUpdateInfo(salonId, updateData)

      expect(result).toEqual(updatedSalonInfo)
      expect(result.minimumAdvanceTime).toBe('48h')
      expect(MockSalonInfoRepository.updateInfo).toHaveBeenCalledWith(salonId, updateData)
    })

    it('should update multiple fields at once', async () => {
      const salonId = 1
      const updateData: Prisma.SalonInfoUpdateInput = {
        name: 'New Salon Name',
        salonEmail: 'newsalon@example.com',
        salonPhoneNumber: '+55 11 99999-9999',
        salonAddress: 'New Address, 123',
        minimumAdvanceTime: '72h'
      }

      const updatedSalonInfo: SalonInfo = {
        id: salonId,
        name: 'New Salon Name',
        openingHours: { monday: '09:00-18:00' },
        salonAddress: 'New Address, 123',
        salonEmail: 'newsalon@example.com',
        salonPhoneNumber: '+55 11 99999-9999',
        minimumAdvanceTime: '72h',
        updatedAt: new Date()
      }

      MockSalonInfoRepository.updateInfo.mockResolvedValue(updatedSalonInfo)

      const result = await salonInfoUseCase.executeUpdateInfo(salonId, updateData)

      expect(result).toEqual(updatedSalonInfo)
      expect(result.name).toBe('New Salon Name')
      expect(result.salonEmail).toBe('newsalon@example.com')
      expect(result.salonPhoneNumber).toBe('+55 11 99999-9999')
      expect(result.salonAddress).toBe('New Address, 123')
      expect(result.minimumAdvanceTime).toBe('72h')
      expect(MockSalonInfoRepository.updateInfo).toHaveBeenCalledWith(salonId, updateData)
    })
  })
})
