import { type Prisma, type Appointment, Status, UserType } from '@prisma/client'
import { type FindByIdAppointments, type AppointmentRepository } from '../repository/protocols/appointment.repository'
import { RecordExistence } from '../utils/validation/record-existence.validation.util'
import { type CustomerRepository } from '../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../repository/protocols/professional.repository'
import { CustomError } from '../utils/errors/custom.error.util'
import { NotificationsUseCase } from './notifications.use-case'

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
    private readonly professionalServiceRepository: ProfessionalRepository,
    private readonly notificationsUseCase: NotificationsUseCase
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

    if (newAppointment) {
      this.notificationsUseCase
        .executeSendOnAppointmentCreated(newAppointment.id)
        .catch(error => {
          console.error(
            'Error while sending appointment created notifications:',
            error?.message || error
          )
        })
    }

    return newAppointment
  }

  public async executeUpdate(
    userDetails: {
      userId: string,
      userType: UserType
    },
    appointmentId: string,
    appointmentToUpdate:
      Prisma.AppointmentUpdateInput
  ) {
    const { userId, userType } = userDetails
    const appointmentById = await this.executeFindById(appointmentId)

    if (appointmentById?.customerId !== userId && appointmentById?.offer.professionalId !== userId) {
      throw new CustomError('You are not allowed to update this appointment', 403)
    }

    const updatedAppointment = await this.appointmentRepository.update(appointmentId, appointmentToUpdate)

    if (updatedAppointment.status === Status.CONFIRMED) {
      this.notificationsUseCase
        .executeSendOnAppointmentConfirmed(updatedAppointment.id)
        .catch(error => {
          console.error(
            'Error while sending appointment confirmed notification to customer:',
            error?.message || error
          )
        })
    }

    if (updatedAppointment.status === Status.CANCELLED) {
      if (userType === 'CUSTOMER') {
        this.notificationsUseCase
          .executeSendOnAppointmentCancelled(updatedAppointment.id, { notifyCustomer: false, notifyProfessional: true })
          .catch(err => console.error('Erro ao enviar notificação de cancelamento para profissional:', err))
      } else {
        this.notificationsUseCase
          .executeSendOnAppointmentCancelled(updatedAppointment.id, { notifyCustomer: true, notifyProfessional: false })
          .catch(err => console.error('Erro ao enviar notificação de cancelamento para cliente:', err))
      }
    }

    return updatedAppointment
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
