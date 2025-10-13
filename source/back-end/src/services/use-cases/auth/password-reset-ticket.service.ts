import crypto from 'crypto'
import { Cache } from '@/services/protocols/cache.protocol'

type TicketPayload = { email: string; userId: string }
const keyTicket = (id: string) => `passwordReset:ticket:${id}`

export class PasswordResetTicketService {
  constructor(private readonly cache: Cache) { }

  async create(payload: TicketPayload, ttlSeconds = 15 * 60) {
    const id = crypto.randomUUID()
    await this.cache.set(keyTicket(id), payload, { timeToLiveSeconds: ttlSeconds })
    return id
  }

  async consume(id: string): Promise<TicketPayload | null> {
    const k = keyTicket(id)
    const data = await this.cache.get<TicketPayload>(k)
    if (!data) return null
    await this.cache.delete(k)
    return data
  }
}
