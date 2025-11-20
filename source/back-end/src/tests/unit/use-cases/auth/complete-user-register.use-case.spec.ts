import { CompleteUserRegisterUseCase } from '@/services/use-cases/auth/complete-user-register.use-case'
import { InvalidUserTypeUseCaseError } from '@/services/use-cases/errors/invalid-user-type-use-case-error'
import { ResourceWithAttributAlreadyExists } from '@/services/use-cases/errors/resource-with-attribute-alreay-exists'
import { UserType, DiscoverySource } from '@prisma/client'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { MockCustomerRepository, MockProfessionalRepository } from '../../utils/mocks/repository'

describe('CompleteUserRegisterUseCase', () => {
  let completeUserRegisterUseCase: CompleteUserRegisterUseCase

  const userId = faker.string.uuid()
  const userEmail = faker.internet.email()

  const mockCustomerData = {
    name: faker.person.fullName(),
    birthdate: faker.date.birthdate(),
    phone: faker.phone.number(),
    discoverySource: faker.helpers.enumValue(DiscoverySource)
  }

  const mockProfessionalData = {
    name: faker.person.fullName(),
    contact: faker.phone.number(),
    socialMedia: [
      {
        name: faker.helpers.arrayElement(['Instagram', 'Facebook', 'TikTok']),
        url: faker.internet.url()
      }
    ],
    paymentMethods: [
      {
        name: faker.helpers.arrayElement(['PIX', 'Dinheiro', 'Cartão'])
      }
    ]
  }

  const mockExistingCustomer = {
    id: userId,
    email: userEmail,
    name: faker.person.fullName(),
    passwordHash: faker.internet.password(),
    googleId: null,
    registerCompleted: false,
    userType: UserType.CUSTOMER,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }

  const mockExistingProfessional = {
    id: userId,
    email: userEmail,
    name: faker.person.fullName(),
    passwordHash: faker.internet.password(),
    googleId: null,
    registerCompleted: false,
    userType: UserType.PROFESSIONAL,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    completeUserRegisterUseCase = new CompleteUserRegisterUseCase(
      MockCustomerRepository,
      MockProfessionalRepository
    )
  })

  it('should be defined', () => {
    expect(CompleteUserRegisterUseCase).toBeDefined()
  })

  describe('execute - Customer', () => {
    it('should complete customer registration with email update when customer exists', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(mockExistingCustomer as any)
      vi.mocked(MockCustomerRepository.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.updateByEmail).mockResolvedValueOnce(mockExistingCustomer as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockCustomerData,
        userId,
        userEmail,
        userType: UserType.CUSTOMER
      })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith('', mockCustomerData.phone)
      expect(MockCustomerRepository.updateByEmail).toHaveBeenCalledWith(userEmail, {
        ...mockCustomerData,
        registerCompleted: true
      })
    })

    it('should complete customer registration with Google ID update when customer has Google ID and no password', async () => {
      // arrange
      const customerWithGoogleId = {
        ...mockExistingCustomer,
        googleId: faker.string.alphanumeric(10),
        passwordHash: null
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(customerWithGoogleId as any)
      vi.mocked(MockCustomerRepository.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.updateByEmailAndGoogleId).mockResolvedValueOnce(customerWithGoogleId as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockCustomerData,
        userId,
        userEmail,
        userType: UserType.CUSTOMER
      })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith('', mockCustomerData.phone)
      expect(MockCustomerRepository.updateByEmailAndGoogleId).toHaveBeenCalledWith(
        userId,
        userEmail,
        {
          ...mockCustomerData,
          registerCompleted: true
        }
      )
      expect(MockCustomerRepository.updateByEmail).not.toHaveBeenCalled()
    })

    it('should throw error when customer with same phone already exists', async () => {
      // arrange
      const existingCustomerWithPhone = {
        id: faker.string.uuid(),
        phone: mockCustomerData.phone
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(mockExistingCustomer as any)
      vi.mocked(MockCustomerRepository.findByEmailOrPhone).mockResolvedValueOnce(existingCustomerWithPhone as any)

      // act & assert
      await expect(
        completeUserRegisterUseCase.execute({
          userData: mockCustomerData,
          userId,
          userEmail,
          userType: UserType.CUSTOMER
        })
      ).rejects.toThrow(
        new ResourceWithAttributAlreadyExists('user', 'phone', mockCustomerData.phone)
      )

      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith('', mockCustomerData.phone)
      expect(MockCustomerRepository.updateByEmail).not.toHaveBeenCalled()
      expect(MockCustomerRepository.updateByEmailAndGoogleId).not.toHaveBeenCalled()
    })

    it('should not update anything when customer does not exist', async () => {
      // arrange
      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(null)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockCustomerData,
        userId,
        userEmail,
        userType: UserType.CUSTOMER
      })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockCustomerRepository.findByEmailOrPhone).not.toHaveBeenCalled()
      expect(MockCustomerRepository.updateByEmail).not.toHaveBeenCalled()
      expect(MockCustomerRepository.updateByEmailAndGoogleId).not.toHaveBeenCalled()
    })
  })

  describe('execute - Professional', () => {
    it('should complete professional registration with email update when professional exists', async () => {
      // arrange
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockProfessionalData,
        userId,
        userEmail,
        userType: UserType.PROFESSIONAL
      })

      // assert
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(userEmail, {
        ...mockProfessionalData,
        registerCompleted: true
      })
    })

    it('should complete professional registration with Google ID update when professional has Google ID and no password', async () => {
      // arrange
      const professionalWithGoogleId = {
        ...mockExistingProfessional,
        googleId: faker.string.alphanumeric(10),
        passwordHash: null
      }

      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(professionalWithGoogleId as any)
      vi.mocked(MockProfessionalRepository.updateByEmailAndGoogleId).mockResolvedValueOnce(professionalWithGoogleId as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockProfessionalData,
        userId,
        userEmail,
        userType: UserType.PROFESSIONAL
      })

      // assert
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockProfessionalRepository.updateByEmailAndGoogleId).toHaveBeenCalledWith(
        userId,
        userEmail,
        {
          ...mockProfessionalData,
          registerCompleted: true
        }
      )
      expect(MockProfessionalRepository.updateProfessionalByEmail).not.toHaveBeenCalled()
    })

    it('should complete manager registration with email update when manager exists', async () => {
      // arrange
      const managerData = {
        ...mockProfessionalData,
        userType: UserType.MANAGER
      }

      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: managerData,
        userId,
        userEmail,
        userType: UserType.MANAGER
      })

      // assert
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(userEmail, {
        ...managerData,
        registerCompleted: true
      })
    })

    it('should not update anything when professional does not exist', async () => {
      // arrange
      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(null)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockProfessionalData,
        userId,
        userEmail,
        userType: UserType.PROFESSIONAL
      })

      // assert
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockProfessionalRepository.updateProfessionalByEmail).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.updateByEmailAndGoogleId).not.toHaveBeenCalled()
    })
  })

  describe('execute - Error handling', () => {
    it('should throw InvalidUserTypeUseCaseError for invalid user type', async () => {
      // arrange
      const invalidUserType = faker.lorem.word() as UserType

      // act & assert
      await expect(
        completeUserRegisterUseCase.execute({
          userData: mockCustomerData,
          userId,
          userEmail,
          userType: invalidUserType
        })
      ).rejects.toThrow(
        new InvalidUserTypeUseCaseError(`Invalid user type provided ${invalidUserType}`)
      )

      expect(MockCustomerRepository.findByEmail).not.toHaveBeenCalled()
      expect(MockProfessionalRepository.findByEmail).not.toHaveBeenCalled()
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete customer flow with all validations', async () => {
      // arrange
      const completeCustomerData = {
        name: faker.person.fullName(),
        birthdate: faker.date.birthdate(),
        phone: faker.phone.number(),
        discoverySource: faker.helpers.enumValue(DiscoverySource)
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(mockExistingCustomer as any)
      vi.mocked(MockCustomerRepository.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.updateByEmail).mockResolvedValueOnce(mockExistingCustomer as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: completeCustomerData,
        userId,
        userEmail,
        userType: UserType.CUSTOMER
      })

      // assert
      expect(MockCustomerRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockCustomerRepository.findByEmailOrPhone).toHaveBeenCalledWith('', completeCustomerData.phone)
      expect(MockCustomerRepository.updateByEmail).toHaveBeenCalledWith(userEmail, {
        ...completeCustomerData,
        registerCompleted: true
      })
    })

    it('should handle complete professional flow with all data', async () => {
      // arrange
      const completeProfessionalData = {
        name: faker.person.fullName(),
        contact: faker.phone.number(),
        socialMedia: [
          { name: faker.company.name(), url: faker.internet.url() },
          { name: faker.company.name(), url: faker.internet.url() }
        ],
        paymentMethods: [
          { name: faker.finance.accountName() },
          { name: faker.finance.accountName() }
        ]
      }

      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(mockExistingProfessional as any)
      vi.mocked(MockProfessionalRepository.updateProfessionalByEmail).mockResolvedValueOnce(mockExistingProfessional as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: completeProfessionalData,
        userId,
        userEmail,
        userType: UserType.PROFESSIONAL
      })

      // assert
      expect(MockProfessionalRepository.findByEmail).toHaveBeenCalledWith(userEmail)
      expect(MockProfessionalRepository.updateProfessionalByEmail).toHaveBeenCalledWith(userEmail, {
        ...completeProfessionalData,
        registerCompleted: true
      })
    })

    it('should handle Google OAuth flow for customer', async () => {
      // arrange
      const googleCustomer = {
        ...mockExistingCustomer,
        googleId: faker.string.alphanumeric(15),
        passwordHash: null
      }

      vi.mocked(MockCustomerRepository.findByEmail).mockResolvedValueOnce(googleCustomer as any)
      vi.mocked(MockCustomerRepository.findByEmailOrPhone).mockResolvedValueOnce(null)
      vi.mocked(MockCustomerRepository.updateByEmailAndGoogleId).mockResolvedValueOnce(googleCustomer as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockCustomerData,
        userId,
        userEmail,
        userType: UserType.CUSTOMER
      })

      // assert
      expect(MockCustomerRepository.updateByEmailAndGoogleId).toHaveBeenCalledWith(
        userId,
        userEmail,
        {
          ...mockCustomerData,
          registerCompleted: true
        }
      )
      expect(MockCustomerRepository.updateByEmail).not.toHaveBeenCalled()
    })

    it('should handle Google OAuth flow for professional', async () => {
      // arrange
      const googleProfessional = {
        ...mockExistingProfessional,
        googleId: faker.string.alphanumeric(15),
        passwordHash: null
      }

      vi.mocked(MockProfessionalRepository.findByEmail).mockResolvedValueOnce(googleProfessional as any)
      vi.mocked(MockProfessionalRepository.updateByEmailAndGoogleId).mockResolvedValueOnce(googleProfessional as any)

      // act
      await completeUserRegisterUseCase.execute({
        userData: mockProfessionalData,
        userId,
        userEmail,
        userType: UserType.PROFESSIONAL
      })

      // assert
      expect(MockProfessionalRepository.updateByEmailAndGoogleId).toHaveBeenCalledWith(
        userId,
        userEmail,
        {
          ...mockProfessionalData,
          registerCompleted: true
        }
      )
      expect(MockProfessionalRepository.updateProfessionalByEmail).not.toHaveBeenCalled()
    })
  })
})
