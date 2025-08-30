import 'dotenv/config'
import { beforeAll, afterAll } from 'vitest'
import { prismaClient } from '../../src/lib/prisma'

let TABLES: string[] = []

beforeAll(async () => {
  await prismaClient.$connect()

  const [{ 'DATABASE()': db }] =
    await prismaClient.$queryRawUnsafe<any[]>('SELECT DATABASE()')

  const rows = await prismaClient.$queryRawUnsafe<any[]>(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = ?',
    db
  )
  TABLES = rows
    .map(r => r.table_name)
    .filter(t => t !== '_prisma_migrations')
})

afterAll(async () => {
  await truncateAll()
  await prismaClient.$disconnect()
})

beforeEach(async () => {
  await truncateAll()
})

async function truncateAll () {
  await prismaClient.$executeRawUnsafe('SET SESSION innodb_lock_wait_timeout = 5')
  await prismaClient.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0')
  for (const t of TABLES) {
    await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE \`${t}\``)
  }
  await prismaClient.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1')
}
