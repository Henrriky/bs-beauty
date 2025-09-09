import jwt from 'jsonwebtoken'
import { CustomerFactory } from '@/tests/factories/customer.factory'
import { ProfessionalFactory } from '@/tests/factories/professional.factory'
import { $Enums, type Professional, type Customer } from '@prisma/client'
import { ENV } from '@/config/env'
import { type TokenPayload } from '@/middlewares/auth/verify-jwt-token.middleware'

const secret = ENV.JWT_SECRET

export async function getProfessionalToken (role: $Enums.UserType = $Enums.UserType.MANAGER): Promise<{ token: string, professional: Professional }> {
  const professional = await ProfessionalFactory.makeProfessional({ userType: role, registerCompleted: true })

  if (secret == null) throw new Error('JWT_SECRET Must be defined.')

  const tokenPayload: TokenPayload = {
    id: professional.id,
    userId: professional.id,
    sub: professional.id,
    userType: professional.userType,
    email: professional.email,
    name: professional.name,
    registerCompleted: professional.registerCompleted,
    profilePhotoUrl: professional.profilePhotoUrl
  }

  return {
    professional,
    token: jwt.sign(tokenPayload, secret, { expiresIn: '1h' })
  }
}

export async function getCustomerToken (): Promise<{ token: string, customer: Customer }> {
  const customer = await CustomerFactory.makeCustomer()

  const tokenPayload: TokenPayload = {
    id: customer.id,
    userId: customer.id,
    sub: customer.id,
    userType: customer.userType,
    email: customer.email,
    name: customer.name,
    registerCompleted: customer.registerCompleted,
    profilePhotoUrl: customer.profilePhotoUrl
  }

  if (secret == null) throw new Error('JWT_SECRET Must be defined.')

  return {
    customer,
    token: jwt.sign(tokenPayload, secret, { expiresIn: '1h' })
  }
}
