import { CustomerRepository } from "@/repository/protocols/customer.repository";
import { ProfessionalRepository } from "@/repository/protocols/professional.repository";
import { RefreshTokenService } from "@/services/encrypter/refresh-token.service";
import { Encrypter } from "@/services/protocols/encrypter.protocol";
import { CustomError } from "@/utils/errors/custom.error.util";

class GenerateTokensUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly professionalRepository: ProfessionalRepository,
    private readonly encrypter: Encrypter,
    private readonly refreshTokenService: RefreshTokenService
  ) { }

  async execute(token: string) {
    const { userId, refreshToken: newRefreshToken } = await this.refreshTokenService.rotate(token)

    const user = await this.customerRepository.findById(userId) ?? await this.professionalRepository.findById(userId)

    if (!user) {
      throw new CustomError(
        'Bad Request',
        400,
        'Invalid credentials'
      )
    }

    const { accessToken } = await this.encrypter.encrypt({
      userId: user.id,
      id: user.id,
      userType: user.userType,
      email: user.email,
      name: user.name,
      registerCompleted: user.registerCompleted,
      profilePhotoUrl: user.profilePhotoUrl ?? ''
    })

    return { accessToken, refreshToken: newRefreshToken }
  }
}

export { GenerateTokensUseCase }