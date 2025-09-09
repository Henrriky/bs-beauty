import { CustomerRepository } from '@/repository/protocols/customer.repository'
import { EmailService } from '@/services/email/email.service'
import { CustomError } from '@/utils/errors/custom.error.util'
import crypto from 'crypto'
import { CodeValidationService } from './code-validation.service'

const RESEND_COOLDOWN_SECONDS = 60
const RESET_TTL_SECONDS = 600

export class PasswordResetRequestUseCase {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly codeValidationService: CodeValidationService,
    private readonly emailService: EmailService,
  ) { }

  async execute(email: string) {
    const customer = await this.customers.findByEmail(email)

    const resendAllowed = await this.codeValidationService.allowResendAndStartCooldown({
      purpose: 'passwordReset',
      recipientId: email,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    })

    if (!resendAllowed) {
      throw new CustomError('Too Many Requests', 429, 'Please wait before requesting another code')
    }

    if (!customer || !customer.passwordHash) return

    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')

    await this.codeValidationService.savePendingCode({
      purpose: 'passwordReset',
      recipientId: email,
      code,
      payload: { customerId: customer.id },
      timeToLiveSeconds: RESET_TTL_SECONDS,
    })

    await this.emailService.sendVerificationCode({
      to: email,
      code,
      expirationCodeTime: RESET_TTL_SECONDS,
      purpose: 'passwordReset'
    })
  }

}
