import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type CodeValidationService } from './services/code-validation.service'
import { CustomError } from '@/utils/errors/custom.error.util'
import { type PasswordResetTicketService } from './services/password-reset-ticket.service'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'

interface Input { email: string, code: string }
interface Output { ticket: string }

export class VerifyPasswordResetUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly codeService: CodeValidationService,
    private readonly ticketService: PasswordResetTicketService
  ) { }

  async execute ({ email, code }: Input): Promise<Output> {
    const result = await this.codeService.verifyCodeAndConsume({
      purpose: 'passwordReset',
      recipientId: email,
      code
    })

    if (!result.ok) {
      throw new CustomError(
        'Bad Request',
        400,
        result.reason === 'INVALID_CODE' ? 'Invalid code' : 'Code expired or not found'
      )
    }

    const payload = result.payload as { userId: string }
    const byId = payload?.userId
    const customer = await this.customerRepository.findById(byId)
    const professional = await this.professionalRepository.findById(byId)

    const user = customer ?? professional

    if (!user) {
      throw new CustomError('Bad Request', 400, 'User not found')
    }

    const ticket = await this.ticketService.create({ email, userId: user.id }, 15 * 60)
    return { ticket }
  }
}
