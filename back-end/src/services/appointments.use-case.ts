import { type Prisma, type Appointment } from '@prisma/client'
import { type AppointmentRepository } from '../repository/protocols/appointment.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'

interface AppointmentOutput {
  appointments: Appointment[]
}

class AppointmentsUseCase {
  private readonly entityName = 'Appointment'

  constructor (private readonly appointmentRepository: AppointmentRepository) { }

  public async executeFindAll (): Promise<AppointmentOutput> {
    const appointments = await this.appointmentRepository.findAll()
    RecordExistence.validateManyRecordsExistence(appointments, 'appointments')

    return { appointments }
  }

  public async executeFindById (appointmentId: string): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findById(appointmentId)
    RecordExistence.validateRecordExistence(appointment, this.entityName)

    return appointment
  }

  public async executeFindByCustomerId (customerId: string): Promise<AppointmentOutput> {
    console.log(customerId)
    const appointments = await this.appointmentRepository.findByCustomerId(customerId)
    RecordExistence.validateManyRecordsExistence(appointments, 'appointments')

    return { appointments }
  }

  public async executeCreate (appointmentToCreate: Prisma.AppointmentCreateInput) {
    const newAppointment = await this.appointmentRepository.create(appointmentToCreate)

    return newAppointment
  }

  public async executeUpdate (appointmentId: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
    await this.executeFindById(appointmentId)
    const updatedCustomer = await this.appointmentRepository.update(appointmentId, appointmentToUpdate)

    return updatedCustomer
  }

  public async executeDelete (appointmentId: string) {
    await this.appointmentRepository.findById(appointmentId)
    const deletedAppointment = await this.appointmentRepository.delete(appointmentId)

    return deletedAppointment
  }
}

export { AppointmentsUseCase }
