import type { NextFunction, Request, Response } from 'express'
import type { Prisma } from '@prisma/client'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'
import { serviceQuerySchema } from '../utils/validation/zod-schemas/pagination/services/services-query.schema'

class ServicesController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const { services } = await useCase.executeFindAll()
      res.send({ services })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const service = await useCase.executeFindById(req.params.id)
      res.send(service)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFetchProfessionalsOfferingService (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const { professionalsOfferingService } = await useCase.fetchProfessionalsOfferingService(req.params.id)

      res.send({ professionalsOfferingService })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const newService: Prisma.ServiceCreateInput = req.body
      const userId = req.user.id
      const service = await useCase.executeCreate(newService, userId)
      res.send(service)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const updatedService: Prisma.ServiceUpdateInput = req.body
      const serviceId = req.params.id
      const userId = req.user.id
      const service = await useCase.executeUpdate(serviceId, updatedService, userId)
      res.send(service)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const serviceId = req.params.id
      const service = await useCase.executeDelete(serviceId)
      res.send(service)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindAllPaginated (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeServiceUseCaseFactory()
      const parsed = serviceQuerySchema.parse(req.query)
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

export { ServicesController }
