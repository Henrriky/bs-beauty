import { type Professional, type Prisma } from '@prisma/client'
import { type ProfessionalRepository } from '../repository/protocols/professional.repository'
import { type RoleRepository } from '../repository/protocols/role.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { CustomError } from '../utils/errors/custom.error.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type ServicesOfferedByProfessional } from '../repository/types/professional-repository.types'
import { type PartialHandleFetchServicesOfferedByProfessionalQuerySchema } from '@/utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'
import { type ProfessionalsFilters } from '@/types/employees/employees-filters'

interface ProfessionalsOutput {
  professionals: Professional[]
}

class ProfessionalsUseCase {
  private readonly entityName = 'Professional'

  constructor (
    private readonly professionalRepository: ProfessionalRepository,
    private readonly roleRepository: RoleRepository
  ) { }

  public async executeFindAll (): Promise<ProfessionalsOutput> {
    const professionals = await this.professionalRepository.findAll()
    RecordExistence.validateManyRecordsExistence(professionals, 'professionals')

    return { professionals }
  }

  public async executeFindById (professionalId: string): Promise<Professional | null> {
    const professional = await this.professionalRepository.findById(professionalId)
    RecordExistence.validateRecordExistence(professional, this.entityName)

    return professional
  }

  public async executeCreate (professionalToCreate: Prisma.ProfessionalCreateInput) {
    const professional = await this.professionalRepository.findByEmail(professionalToCreate.email)
    RecordExistence.validateRecordNonExistence(professional, this.entityName)
    const newProfessional = await this.professionalRepository.create(professionalToCreate)

    return newProfessional
  }

  public async executeUpdate (professionalId: string, professionalToUpdate: Prisma.ProfessionalUpdateInput) {
    await this.executeFindById(professionalId)
    const updatedProfessional = await this.professionalRepository.update(professionalId, professionalToUpdate)

    return updatedProfessional
  }

  public async executeDelete (professionalId: string) {
    await this.executeFindById(professionalId)
    const deletedProfessional = await this.professionalRepository.delete(professionalId)

    return deletedProfessional
  }

  public async fetchServicesOfferedByProfessional (
    professionalId: string,
    params: PaginatedRequest<PartialHandleFetchServicesOfferedByProfessionalQuerySchema>
  ): Promise<{ professional: ServicesOfferedByProfessional }> {
    const { professional } = await this.professionalRepository.fetchServicesOfferedByProfessional(professionalId, params)
    RecordExistence.validateRecordExistence(professional, 'Professional')

    return { professional }
  }

  public async executeFindAllPaginated (
    params: PaginatedRequest<ProfessionalsFilters>
  ): Promise<PaginatedResult<Professional>> {
    const result = await this.professionalRepository.findAllPaginated(params)

    return result
  }

  public async executeAddRole (professionalId: string, roleId: string): Promise<void> {
    await this.executeFindById(professionalId)

    const role = await this.roleRepository.findById(roleId)
    if (role === null) {
      throw new CustomError('Role not found', 404)
    }

    const alreadyAssociated = await this.professionalRepository.findProfessionalRoleAssociation(professionalId, roleId)
    if (alreadyAssociated) {
      throw new CustomError('Professional already has this Role', 409)
    }

    await this.professionalRepository.addRoleToProfessional(professionalId, roleId)
  }

  public async executeRemoveRole (professionalId: string, roleId: string): Promise<void> {
    await this.executeFindById(professionalId)

    const role = await this.roleRepository.findById(roleId)
    if (role === null) {
      throw new CustomError('Role not found', 404)
    }

    const isAssociated = await this.professionalRepository.findProfessionalRoleAssociation(professionalId, roleId)
    if (!isAssociated) {
      throw new CustomError('Professional does not have this Role', 409)
    }

    await this.professionalRepository.removeRoleFromProfessional(professionalId, roleId)
  }
}

export { ProfessionalsUseCase }
