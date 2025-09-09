import { EmailService } from '@/services/email/email.service'
import { Employee } from '@prisma/client'
import bcrypt from 'bcrypt'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { CustomError } from '../../../utils/errors/custom.error.util'
import { CodeValidationService } from './code-validation.service'

interface RegisterUserInput {
  email: string
  password: string
}

const RESEND_COOLDOWN_SECONDS = 60
const PENDING_TTL_SECONDS = 600

export class RegisterUserUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly codeValidationService: CodeValidationService,
    private readonly emailService: EmailService
  ) { }

  async executeRegisterCustomer(input: RegisterUserInput): Promise<void> {
    const { email, password } = input

    const [customerByEmail, employeeByEmail] = await Promise.all([
      this.customerRepository.findByEmail(email),
      this.employeeRepository.findByEmail(email)
    ])

    if (customerByEmail || employeeByEmail) {
      throw new CustomError(
        `Bad Request`,
        400,
        `User with email '${email}' already exists`
      )
    }

    const resendAllowed = await this.codeValidationService.allowResendAndStartCooldown({
      purpose: 'register',
      recipientId: email,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
    })

    if (!resendAllowed) {
      throw new CustomError('Too Many Requests', 429, 'Please wait before requesting another code')
    }

    const code = (Math.floor(100000 + Math.random() * 900000)).toString()
    const passwordHash = await bcrypt.hash(password, 10)

    await this.codeValidationService.savePendingCode({
      purpose: 'register',
      recipientId: email,
      code: code,
      payload: { passwordHash },
      timeToLiveSeconds: PENDING_TTL_SECONDS,
    })

    await this.emailService.sendVerificationCode({
      to: email,
      code,
      expirationCodeTime: PENDING_TTL_SECONDS,
      purpose: 'register'
    })
  }

  async executeRegisterEmployee(input: RegisterUserInput): Promise<void> {
    const { email, password } = input

    const passwordHash = await bcrypt.hash(password, 10)

    await this.employeeRepository.updateEmployeeByEmail(email, {
      email,
      passwordHash,
    })
  }

  async executeFindEmployeeByEmail(email: string): Promise<Employee | null> {
    const employeeByEmail = await this.employeeRepository.findByEmail(email)

    if (!employeeByEmail) {
      throw new CustomError(
        `Bad Request`,
        400,
        `Professional with email '${email}' does not exists`
      )
    }

    return employeeByEmail
  }
}
