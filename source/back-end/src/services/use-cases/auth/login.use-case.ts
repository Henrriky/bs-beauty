import bcrypt from 'bcrypt'
import { type CustomerRepository } from '../../../repository/protocols/customer.repository'
import { type ProfessionalRepository } from '../../../repository/protocols/professional.repository'
import { type CustomerOrProfessional } from '../../../types/customer-or-professional.type'
import { CustomError } from '../../../utils/errors/custom.error.util'
import { type Encrypter } from '../../protocols/encrypter.protocol'
import { type OAuthIdentityProvider } from '../../protocols/oauth-identity-provider.protocol'
import { type RefreshTokenService } from '@/services/encrypter/refresh-token.service'
import { UserType } from '@prisma/client'
import { type Permissions } from '@/utils/auth/permissions-map.util'

interface LoginUseCaseInput {
  token?: string
  email?: string
  password?: string
}

interface LoginUseCaseOutput {
  accessToken: string
  refreshToken: string
}

class LoginUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly encrypter: Encrypter,
    private readonly identityProvider: OAuthIdentityProvider,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  async execute (
    {
      token,
      email,
      password
    }:
    LoginUseCaseInput &
    {
      meta?: {
        ip?: string
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
          userId,
          permissions: []
        }
      } else {
        const professional = await this.professionalRepository.updateProfessionalByEmail(email, {
          googleId: userId,
          profilePhotoUrl
        })
        const permissions = await this.professionalRepository.findProfessionalPermissions(professional.id)
        customerOrProfessional = {
          ...professional,
          userId,
          permissions
        }
      }

      return await this.issueTokensForUser(customerOrProfessional)
    } else if (email && password) {
      const user = await this.customerRepository.findByEmail(email) ?? await this.professionalRepository.findByEmail(email)
      const isPasswordValid = user?.passwordHash && await bcrypt.compare(password, user.passwordHash)

      if (!user || !isPasswordValid) {
        throw new CustomError(
          'Bad Request',
          400,
          'Invalid credentials'
        )
      }
      const permissions: Permissions[] = [
        ...(user.userType === UserType.PROFESSIONAL ? await this.professionalRepository.findProfessionalPermissions(user.id) : [])
      ]

      customerOrProfessional = { ...user, userId: user.id, permissions } satisfies CustomerOrProfessional

      return await this.issueTokensForUser(customerOrProfessional)
    }

    throw new Error('Invalid credentials')
  }

  private async issueTokensForUser (user: CustomerOrProfessional & { userId?: string }): Promise<LoginUseCaseOutput> {
    const subjectUserId = user.userId ?? user.id
    const profilePhotoUrl = user.profilePhotoUrl ?? ''

    const { accessToken } = await this.encrypter.encrypt({
      userId: subjectUserId,
      id: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name,
      registerCompleted: user.registerCompleted,
      profilePhotoUrl,
      permissions: user.permissions
    })

    const { refreshToken } = await this.refreshTokenService.issue(user.id)
    return { accessToken, refreshToken }
  }
}

export { LoginUseCase }
