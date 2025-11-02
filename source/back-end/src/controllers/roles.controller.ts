import { type Prisma } from '@prisma/client'
import { type NextFunction, type Request, type Response } from 'express'
import { roleQuerySchema } from '../utils/validation/zod-schemas/pagination/roles/roles-query.schema'
import { makeRoleUseCaseFactory } from '@/factory/make-role-use-case.factory'

class RolesController {
  public static async handleFindAllPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRoleUseCaseFactory()
      const parsed = roleQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const result = await useCase.executeFindAllPaginated({
        page,
        limit,
        filters
      })
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  // Método simplificado que reutiliza a paginação (aplicando DRY)
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeRoleUseCaseFactory()
      const { roles } = await useCase.executeFindAll()

      res.send({ roles })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id
      const useCase = makeRoleUseCaseFactory()
      const role = await useCase.executeFindById(roleId)

      res.send(role)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindRoleAssociations (req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id
      const useCase = makeRoleUseCaseFactory()
      const parsed = req.query
      const { page = 1, limit = 10, type = 'all' } = parsed

      const result = await useCase.executeFindRoleAssociations(roleId, {
        page: Number(page),
        limit: Number(limit),
        filters: { type: type as 'permission' | 'professional' | 'all' }
      })

      res.send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleAddPermissionToRole (req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id
      const { permissionId } = req.body
      const useCase = makeRoleUseCaseFactory()

      await useCase.executeAddPermissionToRole(roleId, permissionId)

      res.status(201).send({ message: 'Permission added to Role successfully' })
    } catch (error) {
      next(error)
    }
  }

  public static async handleRemovePermissionFromRole (req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = req.params.id
      const { permissionId } = req.body
      const useCase = makeRoleUseCaseFactory()

      await useCase.executeRemovePermissionFromRole(roleId, permissionId)

      res.send({ message: 'Permission removed from Role successfully' })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const roleToCreate: Prisma.RoleCreateInput = req.body
      const useCase = makeRoleUseCaseFactory()
      const role = await useCase.executeCreate(roleToCreate)

      res.status(201).send(role)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const roleToUpdate: Prisma.RoleUpdateInput = req.body
      const roleId: string = req.params.id
      const useCase = makeRoleUseCaseFactory()
      const roleUpdated = await useCase.executeUpdate(roleId, roleToUpdate)

      res.send(roleUpdated)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const roleId: string = req.params.id
      const useCase = makeRoleUseCaseFactory()
      const roleDeleted = await useCase.executeDelete(roleId)

      res.send(roleDeleted)
    } catch (error) {
      next(error)
    }
  }
}

export { RolesController }
