import { type NextFunction, type Request, type Response } from 'express'
import { makeAppointmentsUseCaseFactory } from '../factory/make-appointments-use-case.factory'
import { type Prisma } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { appointmentsQuerySchema } from '@/utils/validation/zod-schemas/pagination/appointments/appointments-query.schema'

class AppointmentController {
  public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentsUseCaseFactory()
      const parsed = appointmentsQuerySchema.parse(req.query)
      const isManager = req.user.userType === 'MANAGER'
      const viewAll = isManager ? parsed.viewAll : false
      const scope = { userId: req.user.id, viewAll } as const
      const { page, limit, ...filters } = parsed
      const result = await useCase.executeFindAllPaginated({ page, limit, filters }, scope)

      res.send(result)
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

      const newAppointment = await useCase.executeCreate(
        appointmentToCreate,
        req.user
      )
      res.status(201)
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
      const updatedAppointment = await useCase.executeUpdate(appointmentId, appointmentToUpdate, req.user)

      res.send(updatedAppointment)
    } catch (error) {
      next(error)
    }
  }

  public static async handleFinishAppointment (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const appointmentId = req.params.id
      const userId = req.user
      const appointmentsUseCase = makeAppointmentsUseCaseFactory()
      const updatedAppointment = await appointmentsUseCase.executeFinishAppointment(
        userId,
        appointmentId
      )
      res.status(StatusCodes.OK).send(updatedAppointment)
    } catch (error) {
      next(error)
    }
  }

  public static async handleDelete (req: Request, res: Response, next: NextFunction) {
    try {
      const useCase = makeAppointmentsUseCaseFactory()
      const appointmentId = req.params.id
      const userId = req.user.id
      const deletedAppointment = await useCase.executeDelete(userId, appointmentId)

      res.send(deletedAppointment)
    } catch (error) {
      next(error)
    }
  }
}

export { AppointmentController }
