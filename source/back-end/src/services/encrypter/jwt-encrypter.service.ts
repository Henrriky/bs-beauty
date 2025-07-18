/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import jwt from 'jsonwebtoken'
import { type CustomerOrEmployee } from '../../types/customer-or-employee.type'
import { type Encrypter } from '../protocols/encrypter.protocol'
import { ENV } from '../../config/env'
import type { StringValue } from 'ms'

class JwtEncrypterService implements Encrypter {
  async encrypt (params: CustomerOrEmployee & { userId: string, profilePhotoUrl: string }): Promise<{ accessToken: string }> {
    const secret: string = ENV.JWT_SECRET
    const expiresIn: StringValue = ENV.JWT_EXPIRES_IN as StringValue

    if (!secret) {
      throw new Error('JWT_SECRET está indefinido')
    }

    const accessToken = jwt.sign(
      {
        id: params.id,
        sub: params.userId,
        userId: params.id,
        userType: params.userType,
        email: params.email,
        name: params.name,
        registerCompleted: params.registerCompleted,
        profilePhotoUrl: params.profilePhotoUrl
      },
      secret,
      {
        expiresIn
      }
    )

    return { accessToken }
  }
}

export { JwtEncrypterService }
