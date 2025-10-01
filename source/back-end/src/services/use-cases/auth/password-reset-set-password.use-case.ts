import bcrypt from 'bcrypt'
import { CustomerRepository } from '@/repository/protocols/customer.repository'
import { PasswordResetTicketService } from './password-reset-ticket.service'
import { CustomError } from '@/utils/errors/custom.error.util'
import { ProfessionalRepository } from '@/repository/protocols/professional.repository'

type Input = { ticket: string; newPassword: string }

export class PasswordResetSetPasswordUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly ticketService: PasswordResetTicketService,
  ) { }

  async execute({ ticket, newPassword }: Input): Promise<void> {
    const data = await this.ticketService.consume(ticket)
    if (!data) {
      throw new CustomError('Bad Request', 400, 'EXPIRED_OR_NOT_FOUND')
    }

    const customer = await this.customerRepository.findById(data.userId)
    const professional = await this.professionalRepository.findById(data.userId)

    const user = customer ?? professional

    if (!user) {
      throw new CustomError('Bad Request', 400, 'EXPIRED_OR_NOT_FOUND')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    if (user.userType === 'CUSTOMER') {
      await this.customerRepository.update(
        data.userId,
        {
          passwordHash
        }
      )
    } else {
      await this.professionalRepository.update(
        data.userId,
        {
          passwordHash
        }
      )
    } 

  }
}
