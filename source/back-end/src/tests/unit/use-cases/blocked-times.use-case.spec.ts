import { BlockedTimesUseCase } from '@/services/blocked-times.use-case'
import { MockBlockedTimesRepository, MockProfessionalRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { NotificationChannel, UserType, type Professional, type BlockedTime } from '@prisma/client'
import { PERMISSIONS_MAP } from '@/utils/auth/permissions-map.util'

const createMockBlockedTime = (professionalId: string): BlockedTime => ({
  id: faker.string.uuid(),
  professionalId,
  startDate: new Date('2024-01-01T09:00:00'),
  endDate: new Date('2024-01-01T18:00:00'),
  startTime: new Date('2024-01-01T09:00:00'),
  endTime: new Date('2024-01-01T10:00:00'),
  reason: faker.lorem.sentence(),
  isActive: true,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
  createdAt: faker.date.past(),
  updatedAt: faker.date.past()
})

describe('BlockedTimesUseCase (Unit Tests)', () => {
  let blockedTimesUseCase: BlockedTimesUseCase

  beforeEach(() => {
    blockedTimesUseCase = new BlockedTimesUseCase(MockBlockedTimesRepository, MockProfessionalRepository)
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(blockedTimesUseCase).toBeDefined()
  })

  describe('executeFindAllPaginated', () => {
    const mockProfessional: Professional = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    it('should return paginated blocked times for professional without permissions', async () => {
      const mockResult = {
        data: [
          {
            id: faker.string.uuid(),
            professionalId: mockProfessional.id,
            startDate: faker.date.future(),
            endDate: faker.date.future(),
            startTime: faker.date.future(),
            endTime: faker.date.future(),
            reason: faker.lorem.sentence(),
            isActive: true,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
            professional: {
              name: mockProfessional.name
            }
          }
        ],
        total: 1,
        page: 1,
        totalPages: 1,
        limit: 10
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findAllPaginated.mockResolvedValue(mockResult)

      const result = await blockedTimesUseCase.executeFindAllPaginated({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      expect(result).toEqual(mockResult)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.findAllPaginated).toHaveBeenCalledWith({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {
            professionalId: mockProfessional.id
          }
        }
      })
    })

    it('should return paginated blocked times for manager without permissions', async () => {
      const manager = { ...mockProfessional, userType: UserType.MANAGER }
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockProfessionalRepository.findById.mockResolvedValue(manager)
      MockBlockedTimesRepository.findAllPaginated.mockResolvedValue(mockResult)

      const result = await blockedTimesUseCase.executeFindAllPaginated({
        userId: manager.id,
        userType: UserType.MANAGER,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      expect(result).toEqual(mockResult)
      expect(MockBlockedTimesRepository.findAllPaginated).toHaveBeenCalledWith({
        userId: manager.id,
        userType: UserType.MANAGER,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {
            professionalId: undefined
          }
        }
      })
    })

    it('should return paginated blocked times with read_own permission', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findAllPaginated.mockResolvedValue(mockResult)

      const result = await blockedTimesUseCase.executeFindAllPaginated({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_OWN.permissionName],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      expect(result).toEqual(mockResult)
      expect(MockBlockedTimesRepository.findAllPaginated).toHaveBeenCalledWith({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_OWN.permissionName],
        extra: {
          page: 1,
          limit: 10,
          filters: {
            professionalId: mockProfessional.id
          }
        }
      })
    })

    it('should return paginated blocked times with read_all permission', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findAllPaginated.mockResolvedValue(mockResult)

      const result = await blockedTimesUseCase.executeFindAllPaginated({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_ALL.permissionName],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      expect(result).toEqual(mockResult)
      expect(MockBlockedTimesRepository.findAllPaginated).toHaveBeenCalledWith({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_ALL.permissionName],
        extra: {
          page: 1,
          limit: 10,
          filters: {
            professionalId: undefined
          }
        }
      })
    })

    it('should throw forbidden error when user has permissions but not read permissions', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)

      const promise = blockedTimesUseCase.executeFindAllPaginated({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw not found error when professional does not exist', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeFindAllPaginated({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          page: 1,
          limit: 10,
          filters: {}
        }
      })

      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeCreate', () => {
    const mockProfessional: Professional = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    it('should create blocked time without permissions', async () => {
      const startDate = new Date('2024-01-01T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T09:00:00')
      const endTime = new Date('2024-01-01T10:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.create.mockResolvedValue({
        id: faker.string.uuid(),
        professionalId: mockProfessional.id,
        startDate,
        endDate,
        startTime,
        endTime,
        reason: blockedTimeData.reason,
        isActive: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      })

      await blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: blockedTimeData
      })

      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.create).toHaveBeenCalled()
    })

    it('should create blocked time with create_own permission', async () => {
      const startDate = new Date('2024-01-01T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T09:00:00')
      const endTime = new Date('2024-01-01T10:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.create.mockResolvedValue({
        id: faker.string.uuid(),
        professionalId: mockProfessional.id,
        startDate,
        endDate,
        startTime,
        endTime,
        reason: blockedTimeData.reason,
        isActive: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      })

      await blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.CREATE_OWN.permissionName],
        extra: blockedTimeData
      })

      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.create).toHaveBeenCalled()
    })

    it('should throw forbidden error when user has permissions but not create permission', async () => {
      const startDate = new Date('2024-01-01T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T09:00:00')
      const endTime = new Date('2024-01-01T10:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      const promise = blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName],
        extra: blockedTimeData
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw error when professional does not exist', async () => {
      const startDate = new Date('2024-01-01T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T09:00:00')
      const endTime = new Date('2024-01-01T10:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: blockedTimeData
      })

      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw error when start date is after end date', async () => {
      const startDate = new Date('2024-01-02T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T09:00:00')
      const endTime = new Date('2024-01-01T10:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)

      const promise = blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: blockedTimeData
      })

      await expect(promise).rejects.toThrow('Bad Request')
    })

    it('should throw error when start time is after end time', async () => {
      const startDate = new Date('2024-01-01T09:00:00')
      const endDate = new Date('2024-01-01T18:00:00')
      const startTime = new Date('2024-01-01T10:00:00')
      const endTime = new Date('2024-01-01T09:00:00')

      const blockedTimeData = {
        professional: { connect: { id: mockProfessional.id } },
        startDate,
        endDate,
        startTime,
        endTime,
        reason: faker.lorem.sentence()
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)

      const promise = blockedTimesUseCase.executeCreate({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: blockedTimeData
      })

      await expect(promise).rejects.toThrow('Bad Request')
    })
  })

  describe('executeUpdate', () => {
    const mockProfessional: Professional = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    const blockedTime = createMockBlockedTime(mockProfessional.id)

    it('should update blocked time as owner without permissions', async () => {
      const updateData = {
        reason: 'Updated reason'
      }

      const updatedBlockedTime = {
        ...blockedTime,
        reason: updateData.reason
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.update.mockResolvedValue(updatedBlockedTime)

      const result = await blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: mockProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [],
          extra: updateData
        }
      )

      expect(result).toEqual(updatedBlockedTime)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.findById).toHaveBeenCalledWith(blockedTime.id)
      expect(MockBlockedTimesRepository.update).toHaveBeenCalledWith(blockedTime.id, updateData)
    })

    it('should update blocked time as manager without permissions', async () => {
      const manager = { ...mockProfessional, userType: UserType.MANAGER }
      const updateData = {
        reason: 'Updated reason'
      }

      const updatedBlockedTime = {
        ...blockedTime,
        reason: updateData.reason
      }

      MockProfessionalRepository.findById.mockResolvedValue(manager)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.update.mockResolvedValue(updatedBlockedTime)

      const result = await blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: manager.id,
          userType: UserType.MANAGER,
          permissions: [],
          extra: updateData
        }
      )

      expect(result).toEqual(updatedBlockedTime)
    })

    it('should update blocked time with edit_own permission as owner', async () => {
      const updateData = {
        reason: 'Updated reason'
      }

      const updatedBlockedTime = {
        ...blockedTime,
        reason: updateData.reason
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.update.mockResolvedValue(updatedBlockedTime)

      const result = await blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: mockProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [PERMISSIONS_MAP.BLOCKED_TIME.EDIT_OWN.permissionName],
          extra: updateData
        }
      )

      expect(result).toEqual(updatedBlockedTime)
    })

    it('should update blocked time with edit_all permission as non-owner', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }
      const updateData = {
        reason: 'Updated reason'
      }

      const updatedBlockedTime = {
        ...blockedTime,
        reason: updateData.reason
      }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.update.mockResolvedValue(updatedBlockedTime)

      const result = await blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: otherProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [PERMISSIONS_MAP.BLOCKED_TIME.EDIT_ALL.permissionName],
          extra: updateData
        }
      )

      expect(result).toEqual(updatedBlockedTime)
    })

    it('should throw forbidden error when user is not owner and does not have edit_all permission', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }
      const updateData = {
        reason: 'Updated reason'
      }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: otherProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [PERMISSIONS_MAP.BLOCKED_TIME.EDIT_OWN.permissionName],
          extra: updateData
        }
      )

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw forbidden error when user is owner but does not have edit_own permission', async () => {
      const updateData = {
        reason: 'Updated reason'
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: mockProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName],
          extra: updateData
        }
      )

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw error when blocked time does not exist', async () => {
      const updateData = {
        reason: 'Updated reason'
      }

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: mockProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [],
          extra: updateData
        }
      )

      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw error when professional does not exist', async () => {
      const updateData = {
        reason: 'Updated reason'
      }

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeUpdate(
        blockedTime.id,
        {
          userId: mockProfessional.id,
          userType: UserType.PROFESSIONAL,
          permissions: [],
          extra: updateData
        }
      )

      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindById', () => {
    const mockProfessional: Professional = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    const blockedTime = createMockBlockedTime(mockProfessional.id)

    it('should find blocked time by id as owner without permissions', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const result = await blockedTimesUseCase.executeFindById({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.findById).toHaveBeenCalledWith(blockedTime.id)
    })

    it('should find blocked time by id as manager without permissions', async () => {
      const manager = { ...mockProfessional, userType: UserType.MANAGER, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(manager)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const result = await blockedTimesUseCase.executeFindById({
        userId: manager.id,
        userType: UserType.MANAGER,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should find blocked time by id with read_own permission as owner', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const result = await blockedTimesUseCase.executeFindById({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_OWN.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should find blocked time by id with read_all permission as non-owner', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const result = await blockedTimesUseCase.executeFindById({
        userId: otherProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_ALL.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should throw forbidden error when user is not owner and does not have read_all permission', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeFindById({
        userId: otherProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.READ_OWN.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw forbidden error when user is owner but does not have read_own permission', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeFindById({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw error when blocked time does not exist', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeFindById({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw error when professional does not exist', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeFindById({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeDelete', () => {
    const mockProfessional: Professional = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    const blockedTime = createMockBlockedTime(mockProfessional.id)

    it('should delete blocked time as owner without permissions', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.delete.mockResolvedValue()

      const result = await blockedTimesUseCase.executeDelete({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(mockProfessional.id)
      expect(MockBlockedTimesRepository.findById).toHaveBeenCalledWith(blockedTime.id)
      expect(MockBlockedTimesRepository.delete).toHaveBeenCalledWith(blockedTime.id)
    })

    it('should delete blocked time as manager without permissions', async () => {
      const manager = { ...mockProfessional, userType: UserType.MANAGER, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(manager)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.delete.mockResolvedValue()

      const result = await blockedTimesUseCase.executeDelete({
        userId: manager.id,
        userType: UserType.MANAGER,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should delete blocked time with delete_own permission as owner', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.delete.mockResolvedValue()

      const result = await blockedTimesUseCase.executeDelete({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.DELETE_OWN.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should delete blocked time with delete_all permission as non-owner', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)
      MockBlockedTimesRepository.delete.mockResolvedValue()

      const result = await blockedTimesUseCase.executeDelete({
        userId: otherProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.DELETE_ALL.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      expect(result).toEqual(blockedTime)
    })

    it('should throw forbidden error when user is not owner and does not have delete_all permission', async () => {
      const otherProfessional = { ...mockProfessional, id: faker.string.uuid() }

      MockProfessionalRepository.findById.mockResolvedValue(otherProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeDelete({
        userId: otherProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.BLOCKED_TIME.DELETE_OWN.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw forbidden error when user is owner but does not have delete_own permission', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(blockedTime)

      const promise = blockedTimesUseCase.executeDelete({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [PERMISSIONS_MAP.DASHBOARD.TOTAL_EMPLOYEES.permissionName],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Forbidden')
    })

    it('should throw error when blocked time does not exist', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeDelete({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw error when professional does not exist', async () => {
      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeDelete({
        userId: mockProfessional.id,
        userType: UserType.PROFESSIONAL,
        permissions: [],
        extra: {
          blockedTimeId: blockedTime.id
        }
      })

      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindByProfessionalAndPeriod', () => {
    const professionalId = faker.string.uuid()

    const mockProfessional: Professional = {
      id: professionalId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userType: UserType.PROFESSIONAL,
      registerCompleted: true,
      socialMedia: null,
      contact: faker.phone.number(),
      specialization: faker.person.jobType(),
      profilePhotoUrl: faker.internet.url(),
      googleId: null,
      paymentMethods: [],
      passwordHash: faker.internet.password(),
      isCommissioned: false,
      commissionRate: null,
      notificationPreference: NotificationChannel.ALL,
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    }

    it('should find blocked times by professional and period', async () => {
      const startDate = '2024-01-01'
      const endDate = '2024-01-31'

      const blockedTimes: BlockedTime[] = [
        createMockBlockedTime(professionalId)
      ]

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)
      MockBlockedTimesRepository.findByProfessionalAndPeriod.mockResolvedValue(blockedTimes)

      const result = await blockedTimesUseCase.executeFindByProfessionalAndPeriod({
        professionalId,
        startDate,
        endDate
      })

      expect(result).toEqual(blockedTimes)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockBlockedTimesRepository.findByProfessionalAndPeriod).toHaveBeenCalledWith({
        professionalId,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      })
    })

    it('should throw error when professional does not exist', async () => {
      const startDate = '2024-01-01'
      const endDate = '2024-01-31'

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = blockedTimesUseCase.executeFindByProfessionalAndPeriod({
        professionalId,
        startDate,
        endDate
      })

      await expect(promise).rejects.toThrow('Not Found')
    })

    it('should throw error when period is greater than 31 days', async () => {
      const startDate = '2024-01-01'
      const endDate = '2024-02-05'

      MockProfessionalRepository.findById.mockResolvedValue(mockProfessional)

      const promise = blockedTimesUseCase.executeFindByProfessionalAndPeriod({
        professionalId,
        startDate,
        endDate
      })

      await expect(promise).rejects.toThrow('Bad Request')
    })
  })
})
