import { type Request, type Response, type NextFunction } from 'express'
import { makeAppointmentServicesUseCaseFactory } from '../factory/make-appointment-services-use-case.factory'
import { type Prisma } from '@prisma/client'

class AppointmentServiceController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await useCase.executeFindAll()

      res.send({ appointmentServices })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentServiceId = req.params.id
      const useCase = makeAppointmentServicesUseCaseFactory()
      const appointmentService = await useCase.executeFindById(appointmentServiceId)

      res.send(appointmentService)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByAppointmentDate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentDate = new Date(req.params.appointmentDate)
      const useCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await useCase.executeFindByAppointmentDate(appointmentDate)

      res.send({ appointmentServices })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByAppointmentId (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = req.params.appointmentId
      const useCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await useCase.executeFindByAppointmentId(appointmentId)

      res.send({ appointmentServices })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByServiceId (req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.serviceId
      const useCase = makeAppointmentServicesUseCaseFactory()
      const { appointmentServices } = await useCase.executeFindByServiceId(serviceId)

      res.send({ appointmentServices })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentServiceToCreate: Prisma.AppointmentServiceCreateInput = req.body
      const useCase = makeAppointmentServicesUseCaseFactory()
      const newAppointmentService = await useCase.executeCreate(appointmentServiceToCreate)

      res.send(newAppointmentService)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentServiceId = req.params.id
      const appointmentServiceToUpdate: Prisma.AppointmentServiceUpdateInput = req.body
      const useCase = makeAppointmentServicesUseCaseFactory()
      const updatedAppointmentService = await useCase.executeUpdate(appointmentServiceId, appointmentServiceToUpdate)

      res.send(updatedAppointmentService)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentServiceId = req.params.id
      const useCase = makeAppointmentServicesUseCaseFactory()
      const deletedAppointmentService = await useCase.executeDelete(appointmentServiceId)

      res.send(deletedAppointmentService)
    } catch (error) {
      next(error)
    }
  }
}

export { AppointmentServiceController }
