import { Encrypter } from "@/services/protocols/encrypter.protocol"
import { OAuthIdentityProvider } from "@/services/protocols/oauth-identity-provider.protocol"
import { Cache } from "@/services/protocols/cache.protocol"
import { Mocked, vi } from "vitest"
import { RefreshTokenService } from "@/services/encrypter/refresh-token.service"

const MockRefreshTokenService: Mocked<RefreshTokenService> = {
  issue: vi.fn(),
  rotate: vi.fn(),
  revokeByJwt: vi.fn(),
  revokeOne: vi.fn(),
  revokeAll: vi.fn()
} as any

const MockEncrypter: Mocked<Encrypter> = {
  encrypt: vi.fn()
}

const MockOAuthIdentityProvider: Mocked<OAuthIdentityProvider> = {
  fetchUserInformationsFromToken: vi.fn(),
  generateRedirectUri: vi.fn(),
  exchangeCodeByToken: vi.fn()
}

const MockCache = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  incr: vi.fn(),
  ttl: vi.fn(),
  withLock: vi.fn()
} as Mocked<Cache>

export {
  MockCache, MockEncrypter,
  MockOAuthIdentityProvider, MockRefreshTokenService
}
