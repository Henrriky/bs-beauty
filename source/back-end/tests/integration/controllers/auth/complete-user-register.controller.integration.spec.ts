import { faker } from "@faker-js/faker"
import { UserType } from "@prisma/client"
import request from 'supertest'
import { app } from "../../../../src/app"
import { prismaClient } from "../../../../src/lib/prisma"
import { TokenPayload } from "../../../../src/middlewares/auth/verify-jwt-token.middleware"
import { signToken } from "../../utils/auth"

describe('CompleteUserRegisterController - POST /api/auth/register/complete', () => {

  it('should complete customer register', async () => {
    // arrange
    const email = faker.internet.email()

    const customer = await prismaClient.customer.create({
      data: {
        email,
        registerCompleted: false,
      },
    })

    const payload = makeCustomerTokenPayload({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      profilePhotoUrl: null,
      registerCompleted: customer.registerCompleted,
    })

    const token = signToken(payload);
    const phone = faker.string.numeric(11);
    const name = 'John Doe';
    const birthdate = faker.date.birthdate({ mode: 'year', min: 1900, max: 2005 });

    const body = {
      name,
      phone,
      birthdate
    }

    // act
    const res = await request(app)
      .post('/api/auth/register/complete')
      .set('Authorization', `Bearer ${token}`)
      .send(body)

    // assert
    expect(res.status).toBe(204)

    const reloadedCustomer = await prismaClient.customer.findUnique({
      where: { email },
    })
    expect(reloadedCustomer).not.toBeNull()
    expect(reloadedCustomer?.registerCompleted).toBe(true)
    expect(reloadedCustomer?.name).toBe(body.name)
    expect(reloadedCustomer?.phone).toBe(body.phone)
  })

})

function makeCustomerTokenPayload(input: {
  id: string
  email: string
  name?: string | null
  profilePhotoUrl?: string | null
  registerCompleted?: boolean
}): TokenPayload {
  const { id, email, name = null, profilePhotoUrl = null, registerCompleted = false } = input

  const payload = {
    sub: id,
    id,
    userId: id,
    userType: UserType.CUSTOMER,
    email,
    name,
    registerCompleted,
    profilePhotoUrl,
  } satisfies TokenPayload

  return payload
}

