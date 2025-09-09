import { CustomerRepository } from '@/repository/protocols/customer.repository'
import { CodeValidationService } from './code-validation.service'
import { CustomError } from '@/utils/errors/custom.error.util'
import { PasswordResetTicketService } from './password-reset-ticket.service'

type Input = { email: string; code: string }
type Output = { ticket: string }

export class VerifyPasswordResetUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly codeService: CodeValidationService,
    private readonly ticketService: PasswordResetTicketService,
  ) { }

  async execute({ email, code }: Input): Promise<Output> {
    const result = await this.codeService.verifyCodeAndConsume({
      purpose: 'passwordReset',
      recipientId: email,
      code,
    })

    if (!result.ok) {
      throw new CustomError(
        'Bad Request',
        400,
        result.reason === 'INVALID_CODE' ? 'Invalid code' : 'Code expired or not found'
      )
    }

    const payload = result.payload as { customerId: string }
    const byId = payload?.customerId
    const customer = await this.customerRepository.findById(byId)

    if (!customer) {
      throw new CustomError('Bad Request', 400, 'Code expired or not found')
    }

    const ticket = await this.ticketService.create({ email, customerId: customer.id }, 15 * 60)
    return { ticket }
  }
}
