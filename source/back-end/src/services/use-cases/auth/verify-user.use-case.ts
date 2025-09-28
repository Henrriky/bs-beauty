import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { CustomError } from '@/utils/errors/custom.error.util'
import { UserType } from '@prisma/client'
import { CodeValidationService } from './code-validation.service'

interface VerifyCustomerInput {
  email: string
  code: string
}

export class VerifyUserUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly codeValidationService: CodeValidationService
  ) { }

  async execute({ email, code }: VerifyCustomerInput): Promise<{ message: string }> {
    const emailAddress = email.trim().toLowerCase()
    const verificationCode = code.trim()

    const result = await this.codeValidationService.verifyCodeAndConsume({
      purpose: 'register',
      recipientId: emailAddress,
      code: verificationCode,
    })

    if (!result.ok) {
      throw new CustomError(
        'Bad Request',
        400,
        result.reason === 'INVALID_CODE' ? 'Invalid code' : 'Code expired or not found'
      )
    }

    const alreadyExists = await this.customerRepository.findByEmail(emailAddress)
    if (alreadyExists) {
      return { message: 'Account already exists' }
    }

    const { passwordHash } = (result.payload ?? {}) as { passwordHash?: string }
    if (!passwordHash) {
      throw new CustomError('Internal Server Error', 500, 'Missing password hash payload')
    }

    await this.customerRepository.create({
      email: emailAddress,
      userType: UserType.CUSTOMER,
      passwordHash,
      registerCompleted: false,
    })

    return { message: 'Account created' }
  }
}
