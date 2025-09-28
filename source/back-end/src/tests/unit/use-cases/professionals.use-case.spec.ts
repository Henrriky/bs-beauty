import { ProfessionalsUseCase } from '@/services/professionals.use-case'
import { MockProfessionalRepository, MockRoleRepository } from '../utils/mocks/repository'
import { faker } from '@faker-js/faker'
import { Prisma, type Professional, UserType } from '@prisma/client'
import { type ServicesOfferedByProfessional } from '@/repository/types/professional-repository.types'
import bcrypt from 'bcrypt'
import { CustomError } from '@/utils/errors/custom.error.util'

describe('ProfessionalsUseCase (Unit Tests)', () => {
  let professionalsUseCase: ProfessionalsUseCase

  beforeEach(() => {
    professionalsUseCase = new ProfessionalsUseCase(
      MockProfessionalRepository,
      MockRoleRepository
    )
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(professionalsUseCase).toBeDefined()
  })

  describe('executeFindAll', () => {
    it('should return all professionals', async () => {
      const plainPassword = faker.internet.password()
      const passwordHash = await bcrypt.hash(plainPassword, 10)

      const professionals: Professional[] = [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          passwordHash,
          userType: UserType.PROFESSIONAL,
          googleId: null,
          registerCompleted: true,
          socialMedia: {},
          contact: faker.phone.number(),
          specialization: faker.person.jobType(),
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
          profilePhotoUrl: faker.internet.url(),
          paymentMethods: null
        }
      ]

      MockProfessionalRepository.findAll.mockResolvedValue(professionals)

      const result = await professionalsUseCase.executeFindAll()
      expect(result).toEqual({ professionals })
      expect(MockProfessionalRepository.findAll).toHaveBeenCalled()
    })

    it('should throw an error if no professionals are found', async () => {
      MockProfessionalRepository.findAll.mockResolvedValue([])

      const promise = professionalsUseCase.executeFindAll()
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindById', () => {
    it('should return a professional by id', async () => {
      const plainPassword = faker.internet.password()
      const passwordHash = await bcrypt.hash(plainPassword, 10)

      const professional: Professional = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        profilePhotoUrl: faker.internet.url(),
        paymentMethods: null
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)

      const result = await professionalsUseCase.executeFindById(professional.id)
      expect(result).toEqual(professional)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professional.id)
    })

    it('should throw an error if professional is not found', async () => {
      const professionalId = faker.string.uuid()
      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeFindById(professionalId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeCreate', () => {
    it('should create a professional', async () => {
      const professionalToCreate: Prisma.ProfessionalCreateInput = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url()
      }

      const createdProfessional: Professional = {
        name: professionalToCreate.name ?? null,
        id: faker.string.uuid(),
        email: professionalToCreate.email,
        passwordHash: professionalToCreate.passwordHash ?? null,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: professionalToCreate.contact ?? null,
        specialization: professionalToCreate.specialization ?? null,
        profilePhotoUrl: professionalToCreate.profilePhotoUrl ?? null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        paymentMethods: null
      }

      MockProfessionalRepository.findByEmail.mockResolvedValue(null)
      MockProfessionalRepository.create.mockResolvedValue(createdProfessional)

      const result = await professionalsUseCase.executeCreate(professionalToCreate)
      expect(result).toMatchObject(professionalToCreate)
      expect(MockProfessionalRepository.create).toHaveBeenCalledWith(professionalToCreate)
    })

    it('should throw an error if professional email already exists', async () => {
      const professionalToCreate: Prisma.ProfessionalCreateInput = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.PROFESSIONAL,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        profilePhotoUrl: faker.internet.url()
      }

      const existingProfessional: Professional = {
        id: faker.string.uuid(),
        name: professionalToCreate.name ?? null,
        email: professionalToCreate.email,
        passwordHash: professionalToCreate.passwordHash ?? null,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: professionalToCreate.contact ?? null,
        specialization: professionalToCreate.specialization ?? null,
        profilePhotoUrl: professionalToCreate.profilePhotoUrl ?? null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        paymentMethods: null
      }

      MockProfessionalRepository.findByEmail.mockResolvedValue(existingProfessional)

      const promise = professionalsUseCase.executeCreate(professionalToCreate)
      await expect(promise).rejects.toThrow('Bad Request')
    })
  })

  describe('executeUpdate', () => {
    it('should update a professional', async () => {
      const professionalId = faker.string.uuid()
      const professionalToUpdate: Prisma.ProfessionalUpdateInput = {
        name: faker.person.fullName(),
        specialization: faker.person.jobType()
      }

      const plainPassword = faker.internet.password()
      const passwordHash = await bcrypt.hash(plainPassword, 10)

      const updatedProfessional: Professional = {
        id: professionalId,
        name: professionalToUpdate.name as string,
        email: faker.internet.email(),
        passwordHash,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: professionalToUpdate.specialization as string,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        profilePhotoUrl: faker.internet.url(),
        paymentMethods: null
      }

      MockProfessionalRepository.findById.mockResolvedValue(updatedProfessional)
      MockProfessionalRepository.update.mockResolvedValue(updatedProfessional)

      const result = await professionalsUseCase.executeUpdate(professionalId, professionalToUpdate)
      expect(result).toEqual(updatedProfessional)
      expect(MockProfessionalRepository.update).toHaveBeenCalledWith(professionalId, professionalToUpdate)
    })

    it('should throw an error if professional to update is not found', async () => {
      const professionalId = faker.string.uuid()
      const professionalToUpdate: Prisma.ProfessionalUpdateInput = {
        name: faker.person.fullName()
      }

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeUpdate(professionalId, professionalToUpdate)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeDelete', () => {
    it('should delete a professional', async () => {
      const professionalId = faker.string.uuid()
      const plainPassword = faker.internet.password()
      const passwordHash = await bcrypt.hash(plainPassword, 10)
      const professional: Professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        passwordHash,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        profilePhotoUrl: faker.internet.url(),
        paymentMethods: null
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockProfessionalRepository.delete.mockResolvedValue(professional)

      const result = await professionalsUseCase.executeDelete(professionalId)
      expect(result).toEqual(professional)
      expect(MockProfessionalRepository.delete).toHaveBeenCalledWith(professionalId)
    })

    it('should throw an error if professional to delete is not found', async () => {
      const professionalId = faker.string.uuid()
      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeDelete(professionalId)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeFindAllPaginated', () => {
    it('should return paginated professionals', async () => {
      const params = {
        page: 1,
        limit: 10,
        filters: {
          name: faker.person.fullName(),
          specialization: faker.person.jobType()
        }
      }

      const plainPassword = faker.internet.password()
      const passwordHash = await bcrypt.hash(plainPassword, 10)

      const professional: Professional = {
        id: faker.string.uuid(),
        name: params.filters.name,
        email: faker.internet.email(),
        passwordHash,
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: params.filters.specialization,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        profilePhotoUrl: faker.internet.url(),
        paymentMethods: null
      }

      const paginatedResult = {
        data: [professional],
        total: 1,
        page: params.page,
        limit: params.limit,
        totalPages: 1
      }

      MockProfessionalRepository.findAllPaginated.mockResolvedValue(paginatedResult)

      const result = await professionalsUseCase.executeFindAllPaginated(params)
      expect(result).toEqual(paginatedResult)
      expect(MockProfessionalRepository.findAllPaginated).toHaveBeenCalledWith(params)
    })
  })

  describe('fetchServicesOfferedByProfessional', () => {
    it('should return services offered by a professional', async () => {
      const professionalId = faker.string.uuid()
      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      const professional = {
        id: professionalId,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        userType: UserType.PROFESSIONAL,
        googleId: null,
        registerCompleted: true,
        socialMedia: {},
        contact: faker.phone.number(),
        specialization: faker.person.jobType(),
        offers: [{
          id: faker.string.uuid(),
          estimatedTime: 60,
          price: new Prisma.Decimal(100),
          service: {
            id: faker.string.uuid(),
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department()
          }
        }]
      }

      MockProfessionalRepository.fetchServicesOfferedByProfessional.mockResolvedValue({ professional })

      const result = await professionalsUseCase.fetchServicesOfferedByProfessional(professionalId, params)
      expect(result).toEqual({ professional })
      expect(MockProfessionalRepository.fetchServicesOfferedByProfessional).toHaveBeenCalledWith(professionalId, params)
    })

    it('should throw an error if professional is not found', async () => {
      const professionalId = faker.string.uuid()
      const params = {
        page: 1,
        limit: 10,
        filters: {}
      }

      MockProfessionalRepository.fetchServicesOfferedByProfessional.mockResolvedValue({
        professional: null as unknown as ServicesOfferedByProfessional
      })

      const promise = professionalsUseCase.fetchServicesOfferedByProfessional(professionalId, params)
      await expect(promise).rejects.toThrow('Not Found')
    })
  })

  describe('executeAddRole', () => {
    it('should add role to professional successfully', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const role = {
        id: roleId,
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockProfessionalRepository.findProfessionalRoleAssociation.mockResolvedValue(false)
      MockProfessionalRepository.addRoleToProfessional.mockResolvedValue()

      await professionalsUseCase.executeAddRole(professionalId, roleId)

      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).toHaveBeenCalledWith(professionalId, roleId)
      expect(MockProfessionalRepository.addRoleToProfessional).toHaveBeenCalledWith(professionalId, roleId)
    })

    it('should throw error when role is not found', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeAddRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).not.toHaveBeenCalled()
    })

    it('should throw error when professional is not found', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeAddRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockRoleRepository.findById).not.toHaveBeenCalled()
    })

    it('should throw error when professional already has the role', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const role = {
        id: roleId,
        name: 'Admin',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockProfessionalRepository.findProfessionalRoleAssociation.mockResolvedValue(true)

      const promise = professionalsUseCase.executeAddRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).toHaveBeenCalledWith(professionalId, roleId)
      expect(MockProfessionalRepository.addRoleToProfessional).not.toHaveBeenCalled()
    })
  })

  describe('executeRemoveRole', () => {
    it('should remove role from professional successfully', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const role = {
        id: roleId,
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockProfessionalRepository.findProfessionalRoleAssociation.mockResolvedValue(true)
      MockProfessionalRepository.removeRoleFromProfessional.mockResolvedValue()

      await professionalsUseCase.executeRemoveRole(professionalId, roleId)

      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).toHaveBeenCalledWith(professionalId, roleId)
      expect(MockProfessionalRepository.removeRoleFromProfessional).toHaveBeenCalledWith(professionalId, roleId)
    })

    it('should throw error when role is not found', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockRoleRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeRemoveRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).not.toHaveBeenCalled()
    })

    it('should throw error when professional is not found', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      MockProfessionalRepository.findById.mockResolvedValue(null)

      const promise = professionalsUseCase.executeRemoveRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockRoleRepository.findById).not.toHaveBeenCalled()
    })

    it('should throw error when professional does not have the specified role', async () => {
      const roleId = faker.string.uuid()
      const professionalId = faker.string.uuid()

      const role = {
        id: roleId,
        name: 'Editor',
        description: faker.lorem.sentence(),
        isActive: true,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      const professional = {
        id: professionalId,
        name: faker.person.firstName(),
        email: faker.internet.email(),
        googleId: null,
        registerCompleted: true,
        paymentMethods: null,
        socialMedia: null,
        contact: faker.phone.number(),
        specialization: faker.lorem.word(),
        profilePhotoUrl: null,
        userType: 'PROFESSIONAL' as const,
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      }

      MockRoleRepository.findById.mockResolvedValue(role)
      MockProfessionalRepository.findById.mockResolvedValue(professional)
      MockProfessionalRepository.findProfessionalRoleAssociation.mockResolvedValue(false)

      const promise = professionalsUseCase.executeRemoveRole(professionalId, roleId)

      await expect(promise).rejects.toBeInstanceOf(CustomError)
      expect(MockRoleRepository.findById).toHaveBeenCalledWith(roleId)
      expect(MockProfessionalRepository.findById).toHaveBeenCalledWith(professionalId)
      expect(MockProfessionalRepository.findProfessionalRoleAssociation).toHaveBeenCalledWith(professionalId, roleId)
      expect(MockProfessionalRepository.removeRoleFromProfessional).not.toHaveBeenCalled()
    })
  })
})
