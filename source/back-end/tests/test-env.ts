import 'dotenv/config';
import { beforeAll, afterAll } from 'vitest';
import { prismaClient } from '../src/lib/prisma';

beforeAll(async () => {
  await prismaClient.$connect();
});

afterAll(async () => {
  await prismaClient.$disconnect();
  await truncateAll();
});

beforeEach(async () => {
  await truncateAll();
});

export async function truncateAll() {
  const [{ 'DATABASE()': db }] =
    await prismaClient.$queryRawUnsafe<any[]>(`SELECT DATABASE()`);

  const tables = await prismaClient.$queryRawUnsafe<any[]>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
    db
  );

  await prismaClient.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0`);
  for (const { table_name } of tables) {
    if (table_name === '_prisma_migrations') continue;
    await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE \`${table_name}\``);
  }
  await prismaClient.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1`);
}
