import bcrypt from 'bcrypt'
import { CustomerRepository } from '@/repository/protocols/customer.repository'
import { PasswordResetTicketService } from './password-reset-ticket.service'
import { CustomError } from '@/utils/errors/custom.error.util'

type Input = { ticket: string; newPassword: string }

export class PasswordResetSetPasswordUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly ticketService: PasswordResetTicketService,
  ) { }

  async execute({ ticket, newPassword }: Input): Promise<void> {
    const data = await this.ticketService.consume(ticket)
    if (!data) {
      throw new CustomError('Bad Request', 400, 'EXPIRED_OR_NOT_FOUND')
    }

    const customer = await this.customerRepository.findById(data.customerId)

    if (!customer) {
      throw new CustomError('Bad Request', 400, 'EXPIRED_OR_NOT_FOUND')
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await this.customerRepository.update(
      data.customerId,
      {
        passwordHash
      }
    )
  }
}
