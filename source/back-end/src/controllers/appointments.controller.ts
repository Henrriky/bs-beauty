import { type NextFunction, type Request, type Response } from 'express'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type Prisma } from '@prisma/client'

class AppointmentController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentsUseCaseFactory()
      const { appointments } = await useCase.executeFindAll()

      res.send({ appointments })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindById (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentId = req.params.id
      const useCase = makeAppointmentsUseCaseFactory()
      const appointment = await useCase.executeFindById(appointmentId)

      res.send(appointment)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByCustomerOrProfessionalId (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentsUseCaseFactory()
      const customerId = req.user.id

      const { appointments } = await useCase.executeFindByCustomerOrProfessionalId(customerId)

      res.send({ appointments }).status(200)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByAppointmentDate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentDate = new Date(req.params.appointmentDate)
      const useCase = makeAppointmentsUseCaseFactory()
      const { appointments } = await useCase.executeFindByAppointmentDate(appointmentDate)

      res.send({ appointments })
    } catch (error) {
      next(error)
    }
  }

  public static async handleFindByServiceOfferedId (req: Request, res: Response, next: NextFunction) {
    try {
      const serviceId = req.params.serviceOfferedId
      const useCase = makeAppointmentsUseCaseFactory()
      const { appointments } = await useCase.executeFindByServiceOfferedId(serviceId)

      res.send({ appointments })
    } catch (error) {
      next(error)
    }
  }

  public static async handleCreate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentToCreate: Prisma.AppointmentCreateInput = req.body
      const useCase = makeAppointmentsUseCaseFactory()
      const newAppointment = await useCase.executeCreate(appointmentToCreate)
      res.send(newAppointment)
    } catch (error) {
      next(error)
    }
  }

  public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
    try {
      const appointmentToUpdate: Prisma.AppointmentUpdateInput = req.body
      const appointmentId = req.params.id
      const useCase = makeAppointmentsUseCaseFactory()
      const updatedAppointment = await useCase.executeUpdate(appointmentId, appointmentToUpdate)

      res.send(updatedAppointment)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentsUseCaseFactory()
      const appointmentId = req.params.id
      const deletedAppointment = await useCase.executeDelete(appointmentId)

      res.send(deletedAppointment)
    } catch (error) {
      next(error)
    }
  }
}

export { AppointmentController }
