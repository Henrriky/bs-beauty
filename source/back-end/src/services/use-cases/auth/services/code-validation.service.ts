import { type Cache } from '@/services/protocols/cache.protocol'
import crypto from 'crypto'

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex')
const keyCooldown = (p: VerificationPurpose, id: string) => `code:${p}:cooldown:${id.trim().toLowerCase()}`
const keyPending = (p: VerificationPurpose, id: string) => `code:${p}:${id.trim().toLowerCase()}`
const keyLock = (p: VerificationPurpose, id: string) => `lock:code:${p}:${id.trim().toLowerCase()}`

type PendingPayload = Record<string, unknown>

interface PendingEntry {
  payload: PendingPayload
  verificationCodeHash: string
  createdAtMillis: number
}

export type VerificationPurpose =
  | 'register'
  | 'passwordReset'

export class CodeValidationService {
  constructor (
    private readonly cache: Cache
  ) { }

  async savePendingCode (params: {
    purpose: VerificationPurpose
    recipientId: string
    code: string
    payload: PendingPayload
    timeToLiveSeconds?: number
  }) {
    const { purpose, recipientId, code, payload, timeToLiveSeconds = 600 } = params
    const entry: PendingEntry = {
      payload,
      verificationCodeHash: sha256(code),
      createdAtMillis: Date.now()
    }
    await this.cache.set(keyPending(purpose, recipientId), entry, { timeToLiveSeconds })
  }

  async allowResendAndStartCooldown (params: {
    purpose: VerificationPurpose
    recipientId: string
    cooldownSeconds?: number
  }) {
    const { purpose, recipientId, cooldownSeconds = 60 } = params
    return await this.cache.set(
      keyCooldown(purpose, recipientId),
      1,
      { onlyIfNotExists: true, timeToLiveSeconds: cooldownSeconds }
    )
  }

  async verifyCodeAndConsume (params: {
    purpose: VerificationPurpose
    recipientId: string
    code: string
  }): Promise<
    | { ok: true, payload: PendingPayload }
    | { ok: false, reason: 'INVALID_CODE' | 'EXPIRED_OR_NOT_FOUND' }
    > {
    const { purpose, recipientId, code } = params
    return await this.cache.withLock(keyLock(purpose, recipientId), 5, async () => {
      const pendingKey = keyPending(purpose, recipientId)
      const pending = await this.cache.get<PendingEntry>(pendingKey)
      if (!pending) return { ok: false, reason: 'EXPIRED_OR_NOT_FOUND' } as const

      if (pending.verificationCodeHash !== sha256(code)) {
        return { ok: false, reason: 'INVALID_CODE' } as const
      }

      await this.cache.delete(pendingKey)
      return { ok: true, payload: pending.payload } as const
    })
  }
}
