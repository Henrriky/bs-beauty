import { type Role, type Prisma } from '@prisma/client'
import { type RoleRepository } from '../repository/protocols/role.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { CustomError } from '../utils/errors/custom.error.util'
import { type PaginatedRequest, type PaginatedResult } from '../types/pagination'
import { type RoleFilters } from '../types/roles/role-filters'
import { type RoleAssociation, type RoleAssociationFilters } from '../types/roles/role-associations'

interface RolesOutput {
  roles: Role[]
}

class RoleUseCase {
  private readonly entityName = 'Role'

  constructor (
    private readonly roleRepository: RoleRepository
  ) { }

  public async executeFindAllPaginated (params: PaginatedRequest<RoleFilters>): Promise<PaginatedResult<Role>> {
    const result = await this.roleRepository.findAllPaginated(params)

    return result
  }

  // Método simplificado que reutiliza a paginação (aplicando DRY)
  public async executeFindAll (): Promise<RolesOutput> {
    const result = await this.executeFindAllPaginated({
      page: 1,
      limit: 1000, // Limite alto para simular "todos os registros"
      filters: {}
    })

    return { roles: result.data }
  }

  public async executeFindById (roleId: string): Promise<Role | null> {
    const role = await this.roleRepository.findById(roleId)
    RecordExistence.validateRecordExistence(role, this.entityName)

    return role
  }

  public async executeFindRoleAssociations (roleId: string, params: PaginatedRequest<RoleAssociationFilters>): Promise<PaginatedResult<RoleAssociation>> {
    await this.executeFindById(roleId)
    const result = await this.roleRepository.findRoleAssociations(roleId, params)

    return result
  }

  public async executeAddPermissionToRole (roleId: string, permissionId: string): Promise<void> {
    await this.executeFindById(roleId)

    const permission = await this.roleRepository.findPermissionById(permissionId)
    if (permission === null) {
      throw new CustomError('Permission not found', 404)
    }

    const alreadyAssociated = await this.roleRepository.findRolePermissionAssociation(roleId, permissionId)
    if (alreadyAssociated) {
      throw new CustomError('Permission already associated with Role', 409)
    }

    await this.roleRepository.addPermissionToRole(roleId, permissionId)
  }

  public async executeRemovePermissionFromRole (roleId: string, permissionId: string): Promise<void> {
    await this.executeFindById(roleId)

    const permission = await this.roleRepository.findPermissionById(permissionId)
    if (permission === null) {
      throw new CustomError('Permission not found', 404)
    }

    const isAssociated = await this.roleRepository.findRolePermissionAssociation(roleId, permissionId)
    if (!isAssociated) {
      throw new CustomError('Permission is not associated with Role', 409)
    }

    await this.roleRepository.removePermissionFromRole(roleId, permissionId)
  }

  public async executeCreate (roleToCreate: Prisma.RoleCreateInput): Promise<Role> {
    // Validar se já existe uma role com o mesmo nome (RN-1)
    const existingRole = await this.roleRepository.findByName(roleToCreate.name)
    RecordExistence.validateRecordNonExistence(existingRole, this.entityName)

    const newRole = await this.roleRepository.create(roleToCreate)

    return newRole
  }

  public async executeUpdate (roleId: string, roleToUpdate: Prisma.RoleUpdateInput): Promise<Role> {
    await this.executeFindById(roleId)

    // Se estiver atualizando o nome, verificar se não existe outro com o mesmo nome
    if (roleToUpdate.name != null) {
      const existingRole = await this.roleRepository.findByName(roleToUpdate.name as string)
      if (existingRole != null && existingRole.id !== roleId) {
        RecordExistence.validateRecordNonExistence(existingRole, this.entityName)
      }
    }

    const updatedRole = await this.roleRepository.update(roleId, roleToUpdate)

    return updatedRole
  }

  public async executeDelete (roleId: string): Promise<Role> {
    // Verificar se a role existe
    const role = await this.roleRepository.findById(roleId)
    if (role == null) {
      throw new CustomError('Role não encontrada', 404)
    }

    // Verificar se há profissionais utilizando esta role
    const professionalsCount = await this.roleRepository.countProfessionalsWithRole(roleId)
    if (professionalsCount > 0) {
      throw new CustomError('Não é possível excluir uma role que está sendo utilizada por profissionais', 409)
    }

    // Excluir a role
    const deletedRole = await this.roleRepository.delete(roleId)
    return deletedRole
  }
}

export { RoleUseCase }
