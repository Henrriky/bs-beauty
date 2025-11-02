import { type CustomerRepository } from '@/repository/protocols/customer.repository'
import { type ProfessionalRepository } from '@/repository/protocols/professional.repository'
import { type RefreshTokenService } from '@/services/encrypter/refresh-token.service'
import { type Encrypter } from '@/services/protocols/encrypter.protocol'
import { type Permissions } from '@/utils/auth/permissions-map.util'
import { CustomError } from '@/utils/errors/custom.error.util'
import { UserType } from '@prisma/client'

class GenerateTokensUseCase {
  constructor (
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly encrypter: Encrypter,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  async execute (token: string) {
    const { userId, refreshToken: newRefreshToken } = await this.refreshTokenService.rotate(token)

    const user = await this.customerRepository.findById(userId) ?? await this.professionalRepository.findById(userId)
    const permissions: Permissions[] = []

    if (!user) {
      throw new CustomError(
        'Bad Request',
        400,
        'Invalid credentials'
      )
    }

    if (user.userType === UserType.PROFESSIONAL) { permissions.push(...await this.professionalRepository.findProfessionalPermissions(user.id)) }

    const { accessToken } = await this.encrypter.encrypt({
      userId: user.googleId ?? user.id,
      id: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name,
      registerCompleted: user.registerCompleted,
      profilePhotoUrl: user.profilePhotoUrl ?? '',
      permissions
    })

    return { accessToken, refreshToken: newRefreshToken }
  }
}

export { GenerateTokensUseCase }
