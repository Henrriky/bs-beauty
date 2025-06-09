import { z } from 'zod'

const parsePageOrLimit = (val: unknown, defaultValue: number) => {
  const parsed = parseInt((val ?? '').toString(), 10);
  return isNaN(parsed) || parsed <= 0 ? defaultValue : parsed;
};

export const basePaginationSchema = z.object({
  page: z.preprocess(
    val => parsePageOrLimit(val, 1),
    z.number().int().positive().default(1)
  ),
  limit: z.preprocess(
    val => parsePageOrLimit(val, 10),
    z.number().int().positive().max(50).default(10)
  ),
})

