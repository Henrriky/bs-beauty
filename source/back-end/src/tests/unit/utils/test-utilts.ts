import type { Request, Response } from 'express'
import { vi } from 'vitest'
import { type TokenPayload } from '../../../middlewares/auth/verify-jwt-token.middleware'

export type MockRequest = Request & {
  user?: TokenPayload
}

export function mockRequest (options?: {
  headers?: Record<string, string>
  body?: any
  params?: any
  query?: any
  user?: TokenPayload
}): MockRequest {
  return {
    headers: options?.headers ?? {},
    body: options?.body ?? {},
    params: options?.params ?? {},
    query: options?.query ?? {},
    get: vi.fn((header: string) => {
      return options?.headers?.[header.toLowerCase()] ?? undefined
    }),
    user: options?.user
  } as unknown as MockRequest
}

export function mockResponse (): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
    json: vi.fn().mockReturnThis(),
    end: vi.fn()
  }
  return res as unknown as Response
}
