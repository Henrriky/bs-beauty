import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { ExchangeCodeByTokenUseCase } from '../../../../services/use-cases/auth/exchange-code-by-token.use-case'
import { type OAuthIdentityProvider } from '../../../../services/protocols/oauth-identity-provider.protocol'

describe('ExchangeCodeByTokenUseCase', () => {
  let identityProviderMock: OAuthIdentityProvider
  let exchangeCodeByTokenUseCase: ExchangeCodeByTokenUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    identityProviderMock = {
      generateRedirectUri: vi.fn(),
      fetchUserInformationsFromToken: vi.fn(),
      exchangeCodeByToken: vi.fn()
    }

    exchangeCodeByTokenUseCase = new ExchangeCodeByTokenUseCase(identityProviderMock)
  })

  it('should be defined', () => {
    expect(ExchangeCodeByTokenUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should exchange code for access token successfully', async () => {
      // arrange
      const mockCode = faker.string.alphanumeric(32)
      const mockAccessToken = faker.string.alphanumeric(64)

      vi.mocked(identityProviderMock.exchangeCodeByToken).mockResolvedValueOnce({
        accessToken: mockAccessToken
      })

      // act
      const result = await exchangeCodeByTokenUseCase.execute({ code: mockCode })

      // assert
      expect(identityProviderMock.exchangeCodeByToken).toHaveBeenCalledTimes(1)
      expect(identityProviderMock.exchangeCodeByToken).toHaveBeenCalledWith(mockCode)
      expect(result).toEqual({
        accessToken: mockAccessToken
      })
    })

    it('should handle different code formats', async () => {
      // arrange
      const testCodes = [
        'short',
        faker.string.alphanumeric(64),
        'code-with-dashes',
        'code_with_underscores',
        '1234567890abcdef',
        faker.string.uuid()
      ]

      for (const code of testCodes) {
        const expectedToken = faker.string.alphanumeric(64)
        vi.mocked(identityProviderMock.exchangeCodeByToken).mockResolvedValueOnce({
          accessToken: expectedToken
        })

        // act
        const result = await exchangeCodeByTokenUseCase.execute({ code })

        // assert
        expect(identityProviderMock.exchangeCodeByToken).toHaveBeenCalledWith(code)
        expect(result.accessToken).toBe(expectedToken)
      }
    })

    it('should propagate identity provider errors', async () => {
      // arrange
      const mockCode = faker.string.alphanumeric(32)
      const expectedError = new Error('Invalid authorization code')

      vi.mocked(identityProviderMock.exchangeCodeByToken).mockRejectedValueOnce(expectedError)

      // act & assert
      await expect(
        exchangeCodeByTokenUseCase.execute({ code: mockCode })
      ).rejects.toThrow('Invalid authorization code')

      expect(identityProviderMock.exchangeCodeByToken).toHaveBeenCalledWith(mockCode)
    })

    it('should handle empty access token from provider', async () => {
      // arrange
      const mockCode = faker.string.alphanumeric(32)

      vi.mocked(identityProviderMock.exchangeCodeByToken).mockResolvedValueOnce({
        accessToken: ''
      })

      // act
      const result = await exchangeCodeByTokenUseCase.execute({ code: mockCode })

      // assert
      expect(result.accessToken).toBe('')
      expect(identityProviderMock.exchangeCodeByToken).toHaveBeenCalledWith(mockCode)
    })

    it('should handle network/API errors from identity provider', async () => {
      // arrange
      const mockCode = faker.string.alphanumeric(32)
      const networkError = new Error('Network timeout')

      vi.mocked(identityProviderMock.exchangeCodeByToken).mockRejectedValueOnce(networkError)

      // act & assert
      await expect(
        exchangeCodeByTokenUseCase.execute({ code: mockCode })
      ).rejects.toThrow('Network timeout')
    })
  })
})
