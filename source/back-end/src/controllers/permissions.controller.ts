import { type NextFunction, type Request, type Response } from 'express'
import { makePermissionUseCaseFactory } from '../factory/make-permission-use-case.factory'
import { permissionQuerySchema } from '../utils/validation/zod-schemas/pagination/permissions/permissions-query.schema'

class PermissionsController {
  public static async handleFindAllPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makePermissionUseCaseFactory()
      const parsed = permissionQuerySchema.parse(req.query)
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
}

export { PermissionsController }
