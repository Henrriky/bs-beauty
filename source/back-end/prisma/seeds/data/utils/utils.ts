import { faker } from '@faker-js/faker'

export function generatePhoneNumber(): string {
  const ddd = faker.helpers.arrayElement(['11', '21', '31', '41', '51', '61', '71', '81'])
  const prefix = '9' + faker.string.numeric(4)
  const suffix = faker.string.numeric(4)
  return `(${ddd}) ${prefix}-${suffix}`
}