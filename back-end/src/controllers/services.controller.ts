import type { Request, Response } from 'express'
import type { Prisma } from '@prisma/client'
import { makeServiceUseCaseFactory } from '../factory/make-service-use-case.factory'

class ServicesController {
  public static async handleFindAll (req: Request, res: Response) {
    const useCase = makeServiceUseCaseFactory()
    const { services } = await useCase.executeFindAll()

    res.send({ services })
  }

  public static async handleFindById (req: Request, res: Response) {
    const useCase = makeServiceUseCaseFactory()
    const service = await useCase.executeFindById(req.params.id)

    res.send(service)
  }

  public static async handleCreate (req: Request, res: Response) {
    const useCase = makeServiceUseCaseFactory()
    const newService: Prisma.ServiceCreateInput = req.body
    const service = await useCase.executeCreate(newService)

    res.send(service)
  }

  public static async handleUpdate (req: Request, res: Response) {
    const useCase = makeServiceUseCaseFactory()
    const updatedService: Prisma.ServiceUpdateInput = req.body
    const serviceId = req.params.id
    const service = await useCase.executeUpdate(serviceId, updatedService)

    res.send(service)
  }

  public static async handleDelete (req: Request, res: Response) {
    const useCase = makeServiceUseCaseFactory()
    const serviceId = req.params.id
    const service = await useCase.executeDelete(serviceId)

    res.send(service)
  }
}

export { ServicesController }
