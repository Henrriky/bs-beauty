import { type Prisma, type Appointment } from '@prisma/client'
import { type FindByIdAppointments, type AppointmentRepository } from '../repository/protocols/appointment.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type CustomerRepository } from '../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../repository/protocols/professional.repository'
import { CustomError } from '../utils/errors/custom.error.util'

export const MINIMUM_SCHEDULLING_TIME_MINUTES = 30
export const MINIMUM_SCHEDULLING_TIME_IN_MILLISECONDS = MINIMUM_SCHEDULLING_TIME_MINUTES * 60 * 1000

export const MAXIMUM_APPOINTMENTS_PER_DAY = 10

interface AppointmentOutput {
  appointments: Appointment[]
}

class AppointmentsUseCase {
  private readonly entityName = 'Appointment'

  constructor (
    private readonly appointmentRepository: AppointmentRepository,
    private readonly customerServiceRepository: CustomerRepository,
    private readonly professionalServiceRepository: ProfessionalRepository
  ) { }

  public async executeFindAll (): Promise<AppointmentOutput> {
    const appointments = await this.appointmentRepository.findAll()

    return { appointments }
  }

  public async executeFindById (appointmentId: string): Promise<FindByIdAppointments | null> {
    const appointment = await this.appointmentRepository.findById(appointmentId)
    RecordExistence.validateRecordExistence(appointment, this.entityName)

    return appointment
  }

  public async executeFindByCustomerOrProfessionalId (customerOrProfessionalId: string): Promise<AppointmentOutput> {
    const customer = await this.customerServiceRepository.findById(customerOrProfessionalId)
    const professional = await this.professionalServiceRepository.findById(customerOrProfessionalId)
    if (customer === null && professional === null) {
      throw new CustomError('Customer or Professional not found', 404, 'Please, provide a valid customer or professional')
    }

    const appointments = await this.appointmentRepository.findByCustomerOrProfessionalId(customerOrProfessionalId)

    return { appointments }
  }

  public async executeFindByServiceOfferedId (appointmentId: string): Promise<AppointmentOutput> {
    const appointments = await this.appointmentRepository.findByServiceOfferedId(appointmentId)

    return { appointments }
  }

  public async executeCreate (appointmentToCreate: Prisma.AppointmentCreateInput, customerId: string) {
    const { appointmentDate } = appointmentToCreate

    const currentTimestamp = new Date()
    const appointmentTimestamp = new Date(appointmentDate)

    if (isNaN(appointmentTimestamp.getTime())) {
      throw new CustomError(`Invalid appointment date provided: ${String(appointmentDate)}`, 400)
    }

    if (appointmentTimestamp < currentTimestamp) {
      throw new CustomError('The selected time is in the past.', 409)
    }

    const remainingTimeUntilAppointment = appointmentTimestamp.getTime() - currentTimestamp.getTime()
    if (remainingTimeUntilAppointment < MINIMUM_SCHEDULLING_TIME_IN_MILLISECONDS) {
      throw new CustomError(
        `The selected time must be at least ${MINIMUM_SCHEDULLING_TIME_MINUTES} minutes in the future.`,
        409
      )
    }

    const appointmentsCount = await this.appointmentRepository.countCustomerAppointmentsPerDay(customerId)
    const maxAppointmentPerDayReached = appointmentsCount >= MAXIMUM_APPOINTMENTS_PER_DAY

    if (maxAppointmentPerDayReached) {
      throw new CustomError(
        'You have reached the maximum number of appointments for today, please try again tomorrow.',
        409
      )
    }

    const newAppointment = await this.appointmentRepository.create(appointmentToCreate)

    return newAppointment
  }

  public async executeUpdate (userId: string, appointmentId: string, appointmentToUpdate: Prisma.AppointmentUpdateInput) {
    const appointmentById = await this.executeFindById(appointmentId)

    if (appointmentById?.customerId !== userId && appointmentById?.offer.professionalId !== userId) {
      throw new CustomError('You are not allowed to update this appointment', 403)
    }

    const updatedCustomer = await this.appointmentRepository.update(appointmentId, appointmentToUpdate)

    return updatedCustomer
  }

  public async executeDelete (userId: string, appointmentId: string) {
    const appointment = await this.executeFindById(appointmentId)
    if (appointment?.customerId !== userId && appointment?.offer.professionalId !== userId) {
      throw new CustomError('You are not allowed to delete this appointment', 403)
    }

    const deletedAppointment = await this.appointmentRepository.delete(appointmentId)

    return deletedAppointment
  }
}

export { AppointmentsUseCase }
