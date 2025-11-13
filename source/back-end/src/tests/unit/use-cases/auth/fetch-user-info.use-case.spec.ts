import { describe, it, expect, beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { UserType, type Customer, type Professional, NotificationChannel } from '@prisma/client'

import { FetchUserInfoUseCase } from '@/services/use-cases/auth/fetch-user-info.use-case'
import { InvalidUserTypeUseCaseError } from '@/services/use-cases/errors/invalid-user-type-use-case-error'
import { NotFoundUseCaseError } from '@/services/use-cases/errors/not-found-error'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'

describe('FetchUserInfoUseCase', () => {
  let fetchUserInfoUseCase: FetchUserInfoUseCase

  beforeEach(() => {
    vi.clearAllMocks()
    fetchUserInfoUseCase = new FetchUserInfoUseCase(
      MockCustomerRepository,
      MockProfessionalRepository
    )
  })

  describe('execute', () => {
    describe('when userType is CUSTOMER', () => {
      it('should return customer info when customer exists', async () => {
        // arrange
        const email = faker.internet.email()
        const mockCustomer: Customer = {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email,
          phone: faker.phone.number(),
          googleId: faker.string.uuid(),
          passwordHash: null,
          userType: UserType.CUSTOMER,
          registerCompleted: true,
          profilePhotoUrl: faker.internet.url(),
          notificationPreference: NotificationChannel.ALL,
          birthdate: faker.date.past(),
          referrerId: null,
          referralCount: 0,
          alwaysAllowImageUse: false,
          discoverySource: 'INSTAGRAM',
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        MockCustomerRepository.findByEmailOrPhone.mockResolvedValue(mockCustomer)

        // act
        const result = await fetchUserInfoUseCase.execute({
          userType: UserType.CUSTOMER,
          email
        })

        // assert
        expect(result).toEqual({ user: mockCustomer })
        expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith(email, '')
        expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledTimes(1)
        expect(MockProfessionalRepository.findByEmail).not.toHaveBeenCalled()
        expect(MockProfessionalRepository.findRolesByProfessionalId).not.toHaveBeenCalled()
      })

      it('should throw NotFoundUseCaseError when customer does not exist', async () => {
        // arrange
        const email = faker.internet.email()
        MockCustomerRepository.findByEmailOrPhone.mockResolvedValue(null)

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.CUSTOMER,
            email
          })
        ).rejects.toThrow(NotFoundUseCaseError)
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.CUSTOMER,
            email
          })
        ).rejects.toThrow('Customer not found')

        expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith(email, '')
        expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledTimes(2)
      })
    })

    describe('when userType is PROFESSIONAL', () => {
      it('should return professional info with roles when professional exists', async () => {
        // arrange
        const email = faker.internet.email()
        const professionalId = faker.string.uuid()

        const mockProfessional: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email,
          googleId: null,
          passwordHash: faker.internet.password(),
          userType: UserType.PROFESSIONAL,
          registerCompleted: true,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: faker.internet.url(),
          socialMedia: {},
          paymentMethods: ['PIX', 'CARTAO_CREDITO'],
          notificationPreference: NotificationChannel.ALL,
          isCommissioned: false,
          commissionRate: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const mockRoles = [
          {
            id: faker.string.uuid(),
            role: {
              id: faker.string.uuid(),
              name: 'PROFESSIONAL',
              description: 'Professional role',
              isActive: true,
              createdAt: faker.date.past(),
              updatedAt: faker.date.past()
            }
          },
          {
            id: faker.string.uuid(),
            role: {
              id: faker.string.uuid(),
              name: 'EDITOR',
              description: 'Editor role',
              isActive: true,
              createdAt: faker.date.past(),
              updatedAt: faker.date.past()
            }
          }
        ]

        MockProfessionalRepository.findByEmail.mockResolvedValue(mockProfessional)
        MockProfessionalRepository.findRolesByProfessionalId.mockResolvedValue(mockRoles)

        // act
        const result = await fetchUserInfoUseCase.execute({
          userType: UserType.PROFESSIONAL,
          email
        })

        // assert
        const expectedResult = {
          user: {
            ...mockProfessional,
            roles: ['PROFESSIONAL', 'EDITOR']
          }
        }
        expect(result).toEqual(expectedResult)
        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledTimes(1)
        expect(MockProfessionalRepository.findRolesByProfessionalId).toHaveBeenCalledWith(professionalId)
        expect(MockProfessionalRepository.findRolesByProfessionalId).toHaveBeenCalledTimes(1)
      })

      it('should return professional info with empty roles array when professional has no roles', async () => {
        // arrange
        const email = faker.internet.email()
        const professionalId = faker.string.uuid()

        const mockProfessional: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email,
          googleId: null,
          passwordHash: faker.internet.password(),
          userType: UserType.PROFESSIONAL,
          registerCompleted: true,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: faker.internet.url(),
          socialMedia: {},
          paymentMethods: null,
          notificationPreference: NotificationChannel.IN_APP,
          isCommissioned: false,
          commissionRate: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        MockProfessionalRepository.findByEmail.mockResolvedValue(mockProfessional)
        MockProfessionalRepository.findRolesByProfessionalId.mockResolvedValue([])

        // act
        const result = await fetchUserInfoUseCase.execute({
          userType: UserType.PROFESSIONAL,
          email
        })

        // assert
        const expectedResult = {
          user: {
            ...mockProfessional,
            roles: []
          }
        }
        expect(result).toEqual(expectedResult)
        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
        expect(MockProfessionalRepository.findRolesByProfessionalId).toHaveBeenCalledWith(professionalId)
      })

      it('should throw NotFoundUseCaseError when professional does not exist', async () => {
        // arrange
        const email = faker.internet.email()
        MockProfessionalRepository.findByEmail.mockResolvedValue(null)

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.PROFESSIONAL,
            email
          })
        ).rejects.toThrow(NotFoundUseCaseError)
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.PROFESSIONAL,
            email
          })
        ).rejects.toThrow('Professional not found')

        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
        expect(MockProfessionalRepository.findRolesByProfessionalId).not.toHaveBeenCalled()
      })
    })

    describe('when userType is MANAGER', () => {
      it('should return professional info with roles when manager exists', async () => {
        // arrange
        const email = faker.internet.email()
        const professionalId = faker.string.uuid()

        const mockProfessional: Professional = {
          id: professionalId,
          name: faker.person.fullName(),
          email,
          googleId: faker.string.uuid(),
          passwordHash: null,
          userType: UserType.MANAGER,
          registerCompleted: true,
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          profilePhotoUrl: null,
          socialMedia: null,
          paymentMethods: null,
          notificationPreference: NotificationChannel.ALL,
          isCommissioned: false,
          commissionRate: null,
          createdAt: faker.date.past(),
          updatedAt: faker.date.past()
        }

        const mockRoles = [
          {
            id: faker.string.uuid(),
            role: {
              id: faker.string.uuid(),
              name: 'MANAGER',
              description: 'Manager role',
              isActive: true,
              createdAt: faker.date.past(),
              updatedAt: faker.date.past()
            }
          }
        ]

        MockProfessionalRepository.findByEmail.mockResolvedValue(mockProfessional)
        MockProfessionalRepository.findRolesByProfessionalId.mockResolvedValue(mockRoles)

        // act
        const result = await fetchUserInfoUseCase.execute({
          userType: UserType.MANAGER,
          email
        })

        // assert
        const expectedResult = {
          user: {
            ...mockProfessional,
            roles: ['MANAGER']
          }
        }
        expect(result).toEqual(expectedResult)
        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
        expect(MockProfessionalRepository.findRolesByProfessionalId).toHaveBeenCalledWith(professionalId)
      })

      it('should throw NotFoundUseCaseError when manager does not exist', async () => {
        // arrange
        const email = faker.internet.email()
        MockProfessionalRepository.findByEmail.mockResolvedValue(null)

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.MANAGER,
            email
          })
        ).rejects.toThrow(NotFoundUseCaseError)
        await expect(
          fetchUserInfoUseCase.execute({
            userType: UserType.MANAGER,
            email
          })
        ).rejects.toThrow('Professional not found')

        expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(email)
      })
    })

    describe('when userType is invalid', () => {
      it('should throw InvalidUserTypeUseCaseError for unsupported user types', async () => {
        // arrange
        const email = faker.internet.email()
        const invalidUserType = 'INVALID_USER_TYPE'

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: invalidUserType,
            email
          })
        ).rejects.toThrow(InvalidUserTypeUseCaseError)
        await expect(
          fetchUserInfoUseCase.execute({
            userType: invalidUserType,
            email
          })
        ).rejects.toThrow('Invalid user type provided INVALID_USER_TYPE')

        expect(MockCustomerRepository.findByEmailOrPhone).not.toHaveBeenCalled()
        expect(MockProfessionalRepository.findByEmail).not.toHaveBeenCalled()
        expect(MockProfessionalRepository.findRolesByProfessionalId).not.toHaveBeenCalled()
      })

      it('should throw InvalidUserTypeUseCaseError for null user type', async () => {
        // arrange
        const email = faker.internet.email()

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: null as any,
            email
          })
        ).rejects.toThrow(InvalidUserTypeUseCaseError)

        expect(MockCustomerRepository.findByEmailOrPhone).not.toHaveBeenCalled()
        expect(MockProfessionalRepository.findByEmail).not.toHaveBeenCalled()
      })

      it('should throw InvalidUserTypeUseCaseError for undefined user type', async () => {
        // arrange
        const email = faker.internet.email()

        // act & assert
        await expect(
          fetchUserInfoUseCase.execute({
            userType: undefined as any,
            email
          })
        ).rejects.toThrow(InvalidUserTypeUseCaseError)

        expect(MockCustomerRepository.findByEmailOrPhone).not.toHaveBeenCalled()
        expect(MockProfessionalRepository.findByEmail).not.toHaveBeenCalled()
      })
    })
  })
})
