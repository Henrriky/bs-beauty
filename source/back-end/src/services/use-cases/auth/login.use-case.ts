import bcrypt from 'bcrypt'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type EmployeeRepository } from '../../../repository/protocols/employee.repository'
import { type CustomerOrEmployee } from '../../../types/customer-or-employee.type'
import { CustomError } from '../../../utils/errors/custom.error.util'
import { type Encrypter } from '../../protocols/encrypter.protocol'
import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'
import { RefreshTokenService } from '@/services/encrypter/refresh-token.service'

interface LoginUseCaseInput {
  token?: string
  email?: string
  password?: string
}

interface LoginUseCaseOutput {
  accessToken: string,
  refreshToken: string
}

class LoginUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly encrypter: Encrypter,
    private readonly identityProvider: OAuthIdentityProvider,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  async execute(
    {
      token,
      email,
      password,
    }:
      LoginUseCaseInput &
      {
        meta?: {
          ip?: string;
          userAgent?: string
        }
      }): Promise<LoginUseCaseOutput> {
    let customerOrEmployee: CustomerOrEmployee | null = null

    if (token) {
      const { userId, email, profilePhotoUrl } = await this.identityProvider.fetchUserInformationsFromToken(token)

      const employeeAlreadyExists = await this.employeeRepository.findByEmail(email)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!employeeAlreadyExists) {
        const customer = await this.customerRepository.updateOrCreate({
          email
        }, {
          email,
          googleId: userId,
          profilePhotoUrl
        })
        customerOrEmployee = {
          ...customer,
          userId
        }
      } else {
        const employee = await this.employeeRepository.updateEmployeeByEmail(email, {
          googleId: userId,
          profilePhotoUrl
        })
        customerOrEmployee = {
          ...employee,
          userId
        }
      }

      return this.issueTokensForUser(customerOrEmployee)
    } else if (email && password) {
      const customer = await this.customerRepository.findByEmail(email)
      const employee = await this.employeeRepository.findByEmail(email)

      const user = customer ?? employee

      let isPasswordValid: boolean = false;

      if (user) {
        isPasswordValid = await bcrypt.compare(password, user!.passwordHash!)
      }

      if (!user || !isPasswordValid) {
        throw new CustomError(
          'Bad Request',
          400,
          'Invalid credentials'
        )
      }

      customerOrEmployee = { ...user, userId: user.id } as CustomerOrEmployee

      return this.issueTokensForUser(customerOrEmployee)
    }

    throw new Error('Invalid credentials')
  }

  private async issueTokensForUser(user: CustomerOrEmployee & { userId?: string }): Promise<LoginUseCaseOutput> {
    const subjectUserId = user.userId ?? user.id
    const profilePhotoUrl = user.profilePhotoUrl ?? ''

    const { accessToken } = await this.encrypter.encrypt({
      userId: subjectUserId,
      id: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name,
      registerCompleted: user.registerCompleted,
      profilePhotoUrl
    })

    const { refreshToken } = await this.refreshTokenService.issue(user.id)
    return { accessToken, refreshToken }
  }
}

export { LoginUseCase }
