import jwt from 'jsonwebtoken'
import type { Secret, SignOptions, JwtPayload } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { ENV } from '@/config/env'
import { type Cache } from '@/services/protocols/cache.protocol'

interface RefreshEntry {
  userId: string
  status: 'active' | 'revoked'
  ipAddress?: string
  userAgent?: string
}

const refreshKey = (refreshTokenId: string) => `refresh-token:${refreshTokenId}`
const userRefreshSetKey = (userId: string) => `user:${userId}:refresh-tokens`

export class RefreshTokenService {
  private readonly secret: Secret = ENV.JWT_SECRET
  private readonly expiresIn: SignOptions['expiresIn'] = (ENV.JWT_REFRESH_EXPIRES_IN as unknown as SignOptions['expiresIn']) ?? '30d'

  constructor (private readonly cache: Cache) { }

  async issue (userId: string) {
    const refreshTokenId = uuidv4()

    const refreshToken = jwt.sign(
      { sub: userId, jti: refreshTokenId },
      this.secret,
      { expiresIn: this.expiresIn }
    )

    const { exp } = jwt.decode(refreshToken) as JwtPayload
    const ttlSeconds = Math.max(1, (exp ?? 0) - Math.floor(Date.now() / 1000))

    const entry: RefreshEntry = {
      userId,
      status: 'active'
    }

    await this.cache.set(refreshKey(refreshTokenId), entry, { timeToLiveSeconds: ttlSeconds })

    const userKey = userRefreshSetKey(userId)
    const list = (await this.cache.get<string[]>(userKey)) ?? []
    list.push(refreshTokenId)
    await this.cache.set(userKey, list, { timeToLiveSeconds: ttlSeconds })

    return { refreshToken, refreshTokenId }
  }

  async rotate (incomingRefreshJwt: string, meta?: { ipAddress?: string, userAgent?: string }) {
    let payload: JwtPayload & { sub: string, jti: string }
    try {
      payload = jwt.verify(incomingRefreshJwt, this.secret) as JwtPayload & { sub: string, jti: string }
    } catch {
      throw new Error('INVALID_OR_EXPIRED')
    }

    const userId = String(payload.sub)
    const refreshTokenId = String(payload.jti)

    const current = await this.cache.get<RefreshEntry>(refreshKey(refreshTokenId))
    if (!current || current.status !== 'active') {
      await this.revokeAll(userId).catch(() => { })
      throw new Error('REUSED_OR_REVOKED')
    }

    await this.cache.set(refreshKey(refreshTokenId), { ...current, status: 'revoked' })

    const next = await this.issue(userId)
    return { userId, ...next }
  }

  async revokeByJwt (incomingRefreshJwt: string) {
    let payload: (JwtPayload & { sub?: string, jti?: string }) | null = null

    try {
      payload = jwt.verify(incomingRefreshJwt, this.secret) as JwtPayload
    } catch {
      payload = jwt.decode(incomingRefreshJwt) as JwtPayload | null
    }

    const jti = payload?.jti
    if (!jti) return

    await this.revokeOne(String(jti)).catch(() => { })
  }

  async revokeOne (refreshTokenId: string) {
    const entry = await this.cache.get<RefreshEntry>(refreshKey(refreshTokenId))
    if (!entry) return
    await this.cache.set(refreshKey(refreshTokenId), { ...entry, status: 'revoked' })
    const userKey = userRefreshSetKey(entry.userId)
    const list = (await this.cache.get<string[]>(userKey)) ?? []
    const filtered = list.filter(id => id !== refreshTokenId)
    await this.cache.set(userKey, filtered)
  }

  async revokeAll (userId: string) {
    const userKey = userRefreshSetKey(userId)
    const list = (await this.cache.get<string[]>(userKey)) ?? []
    await Promise.all(list.map(async id => {
      const e = await this.cache.get<RefreshEntry>(refreshKey(id))
      if (e) await this.cache.set(refreshKey(id), { ...e, status: 'revoked' })
    }))
    await this.cache.delete(userKey)
  }
}
