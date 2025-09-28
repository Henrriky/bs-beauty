import type { NextFunction, Request, Response } from 'express'
import { makeProfessionalsUseCaseFactory } from '../factory/make-professionals-use-case.factory'
import type { Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { handleFetchServicesOfferedByProfessionalQuerySchema, professionalQuerySchema } from '../utils/validation/zod-schemas/pagination/professionals/professionals-query.schema'

class ProfessionalsController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeProfessionalsUseCaseFactory()
      const parsed = professionalQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed

      const result = await useCase.executeFindAllPaginated({
        page,
        limit,
        filters
      })

      res.status(StatusCodes.OK).send(result)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.id
      const useCase = makeProfessionalsUseCaseFactory()
      const professional = await useCase.executeFindById(professionalId)

      res.status(StatusCodes.OK).send(professional)
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const newProfessional: Prisma.ProfessionalCreateInput = req.body
      const useCase = makeProfessionalsUseCaseFactory()
      const professional = await useCase.executeCreate(newProfessional)

      res.status(StatusCodes.CREATED).send(professional)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const professionalToUpdate: Prisma.ProfessionalUpdateInput = req.body
      const professionalId: string = req.params.id
      const useCase = makeProfessionalsUseCaseFactory()
      const professionalUpdated = await useCase.executeUpdate(professionalId, professionalToUpdate)

      res.status(StatusCodes.OK).send(professionalUpdated)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.id
      const useCase = makeProfessionalsUseCaseFactory()
      const professionalDeleted = await useCase.executeDelete(professionalId)

      res.status(StatusCodes.OK).send(professionalDeleted)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFetchServicesOfferedByProfessional (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeProfessionalsUseCaseFactory()
      const parsed = handleFetchServicesOfferedByProfessionalQuerySchema.parse(req.query)
      const { page, limit, ...filters } = parsed
      const { professional } = await useCase.fetchServicesOfferedByProfessional(
        req.params.id,
        {
          page,
          limit,
          filters
        })

      res.send({ professional })
    } catch (error) {
      next(error)
    }
  }

  public static async handleAddRole (req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.id
      const { roleId } = req.body
      const useCase = makeProfessionalsUseCaseFactory()
      await useCase.executeAddRole(professionalId, roleId)

      res.status(StatusCodes.OK).send({ message: 'Role added to professional successfully' })
    } catch (error) {
      next(error)
    }
  }

  public static async handleRemoveRole (req: Request, res: Response, next: NextFunction) {
    try {
      const professionalId = req.params.id
      const { roleId } = req.body
      const useCase = makeProfessionalsUseCaseFactory()
      await useCase.executeRemoveRole(professionalId, roleId)

      res.status(StatusCodes.OK).send({ message: 'Role removed from professional successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export { ProfessionalsController }
