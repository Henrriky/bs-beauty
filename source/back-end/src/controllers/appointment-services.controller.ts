import { type Request, type Response, type NextFunction } from 'express'
import { makeAppointmentServicesUseCaseFactory } from '../factory/make-appointment-services-use-case.factory'
import { type Prisma } from '@prisma/client'

class AppointmentServiceController {
  // public static async handleFindAll (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const { appointmentServices } = await useCase.executeFindAll()

  //     res.send({ appointmentServices })
  //   } catch (error) {
  //     next(error)
  //   }
  // }


  // public static async handleFindByServiceOfferedId (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const serviceId = req.params.serviceOfferedId
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const { appointmentServices } = await useCase.executeFindByServiceOfferedId(serviceId)

  //     res.send({ appointmentServices })
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // public static async handleCreate (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const appointmentServiceToCreate: Prisma.AppointmentServiceCreateInput = req.body
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const newAppointmentService = await useCase.executeCreate(appointmentServiceToCreate)

  //     res.send(newAppointmentService)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // public static async handleUpdate (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const appointmentServiceId = req.params.id
  //     const appointmentServiceToUpdate: Prisma.AppointmentServiceUpdateInput = req.body
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const updatedAppointmentService = await useCase.executeUpdate(appointmentServiceId, appointmentServiceToUpdate)

  //     res.send(updatedAppointmentService)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // public static async handleDelete (req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const appointmentServiceId = req.params.id
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const deletedAppointmentService = await useCase.executeDelete(appointmentServiceId)

  //     res.send(deletedAppointmentService)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // public static async handleFindByCustomerOrEmployeeId (req: Request, res: Response, next: NextFunction) {
  //   // TODO: Create pagination
  //   try {
  //     const useCase = makeAppointmentServicesUseCaseFactory()
  //     const customerId = req.user.id

  //     const { appointments } = await useCase.findByCustomerOrEmployeeId(customerId)

  //     res.send({ appointments }).status(200)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}

export { AppointmentServiceController }
