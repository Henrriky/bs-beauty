import jwt from 'jsonwebtoken'
import { type CustomerOrEmployee } from '../../types/customer-or-employee.type'
import { type Encrypter } from '../protocols/encrypter.protocol'
import { ENV } from '../../config/env'

class JwtEncrypterService implements Encrypter {
  async encrypt (params: CustomerOrEmployee & { userId: string, profilePhotoUrl: string }): Promise<{ accessToken: string }> {
    const accessToken = jwt.sign(
      {
        sub: params.userId,
        userId: params.id,
        role: params.role,
        email: params.email,
        name: params.name,
        registerCompleted: params.registerCompleted,
        profilePhotoUrl: params.profilePhotoUrl
      },
      ENV.JWT_SECRET,
      {
        expiresIn: ENV.JWT_EXPIRES_IN
      }
    )

    return { accessToken }
  }
}

export { JwtEncrypterService }
