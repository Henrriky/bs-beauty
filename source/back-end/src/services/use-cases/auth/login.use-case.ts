import bcrypt from 'bcrypt'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../../../repository/protocols/professional.repository'
import { type CustomerOrProfessional } from '../../../types/customer-or-professional.type'
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
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
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
    let customerOrProfessional: CustomerOrProfessional | null = null

    if (token) {
      const { userId, email, profilePhotoUrl } = await this.identityProvider.fetchUserInformationsFromToken(token)

      const professionalAlreadyExists = await this.professionalRepository.findByEmail(email)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!professionalAlreadyExists) {
        const customer = await this.customerRepository.updateOrCreate({
          email
        }, {
          email,
          googleId: userId,
          profilePhotoUrl
        })
        customerOrProfessional = {
          ...customer,
          userId
        }
      } else {
        const professional = await this.professionalRepository.updateProfessionalByEmail(email, {
          googleId: userId,
          profilePhotoUrl
        })
        customerOrProfessional = {
          ...professional,
          userId
        }
      }

      return this.issueTokensForUser(customerOrProfessional)
    } else if (email && password) {
      const customer = await this.customerRepository.findByEmail(email)
      const professional = await this.professionalRepository.findByEmail(email)

      const user = customer ?? professional

      let isPasswordValid: boolean = false;

      if (user && user.passwordHash) {
        isPasswordValid = await bcrypt.compare(password, user!.passwordHash!)
      }

      if (!user || !isPasswordValid) {
        throw new CustomError(
          'Bad Request',
          400,
          'Invalid credentials'
        )
      }

      customerOrProfessional = { ...user, userId: user.id } as CustomerOrProfessional

      return this.issueTokensForUser(customerOrProfessional)
    }

    throw new Error('Invalid credentials')
  }

  private async issueTokensForUser(user: CustomerOrProfessional & { userId?: string }): Promise<LoginUseCaseOutput> {
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
