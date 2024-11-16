import { type Prisma, type AppointmentService } from '@prisma/client'
import { type AppointmentServiceRepository } from '../repository/protocols/appointment-service.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface AppointmentServiceOutput {
  appointmentServices: AppointmentService[]
}

class AppointmentServicesUseCase {
  constructor (private readonly appointmentServiceRepository: AppointmentServiceRepository) { }

  public async executeFindAll (): Promise<AppointmentServiceOutput> {
    const appointmentServices = await this.appointmentServiceRepository.findAll()
    RecordExistence.validateManyRecordsExistence(appointmentServices, 'appointment services')

    return { appointmentServices }
  }

  public async executeFindById (appointmentServiceId: string): Promise<AppointmentService | null> {
    const appointmentService = await this.appointmentServiceRepository.findById(appointmentServiceId)
    RecordExistence.validateRecordExistence(appointmentService, 'Appointment service')

    return appointmentService
  }

  public async executeFindByAppointmentDate (appointmentDate: Date): Promise<AppointmentServiceOutput> {
    const appointmentServices = await this.appointmentServiceRepository.findByAppointmentDate(appointmentDate)
    RecordExistence.validateManyRecordsExistence(appointmentServices, 'appointment services')

    return { appointmentServices }
  }

  public async executeFindByAppointmentId (appointmentId: string): Promise<AppointmentServiceOutput> {
    const appointmentServices = await this.appointmentServiceRepository.findByAppointmentId(appointmentId)
    RecordExistence.validateManyRecordsExistence(appointmentServices, 'appointment services')

    return { appointmentServices }
  }

  public async executeFindByServiceId (appointmentId: string): Promise<AppointmentServiceOutput> {
    const appointmentServices = await this.appointmentServiceRepository.findByServiceId(appointmentId)
    RecordExistence.validateManyRecordsExistence(appointmentServices, 'appointment services')

    return { appointmentServices }
  }

  public async executeCreate (appointmentServiceToCreate: Prisma.AppointmentServiceCreateInput) {
    const newAppointmentService = await this.appointmentServiceRepository.create(appointmentServiceToCreate)

    return newAppointmentService
  }

  public async executeUpdate (appointmentServiceId: string, appointmentServiceToUpdate: Prisma.AppointmentServiceUpdateInput) {
    await this.executeFindById(appointmentServiceId)
    const updatedAppointmentService = await this.appointmentServiceRepository.update(appointmentServiceId, appointmentServiceToUpdate)

    return updatedAppointmentService
  }

  public async executeDelete (appointmentServiceId: string) {
    await this.executeFindById(appointmentServiceId)
    const deletedAppointmentService = await this.appointmentServiceRepository.delete(appointmentServiceId)

    return deletedAppointmentService
  }
}

export { AppointmentServicesUseCase }