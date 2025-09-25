import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.salonInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'BS Beauty Academy',
    },
  })
}

main()
  .then(() => console.log('✅ Settings seeded'))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())