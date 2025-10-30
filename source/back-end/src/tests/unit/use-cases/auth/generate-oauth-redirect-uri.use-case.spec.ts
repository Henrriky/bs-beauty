import { beforeEach, describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { GenerateOAuthRedirectUriUseCase } from '../../../../services/use-cases/auth/generate-oauth-redirect-uri.use-case'
import { type OAuthIdentityProvider } from '../../../../services/protocols/oauth-identity-provider.protocol'

describe('GenerateOAuthRedirectUriUseCase', () => {
  let identityProviderMock: OAuthIdentityProvider
  let generateOAuthRedirectUriUseCase: GenerateOAuthRedirectUriUseCase

  beforeEach(() => {
    vi.clearAllMocks()

    identityProviderMock = {
      generateRedirectUri: vi.fn(),
      fetchUserInformationsFromToken: vi.fn(),
      exchangeCodeByToken: vi.fn()
    }

    generateOAuthRedirectUriUseCase = new GenerateOAuthRedirectUriUseCase(identityProviderMock)
  })

  it('should be defined', () => {
    expect(GenerateOAuthRedirectUriUseCase).toBeDefined()
  })

  describe('execute', () => {
    it('should generate OAuth redirect URI successfully', () => {
      // arrange
      const mockAuthorizationUrl = faker.internet.url()
      identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue(mockAuthorizationUrl)

      // act
      const result = generateOAuthRedirectUriUseCase.execute()

      // assert
      expect(identityProviderMock.generateRedirectUri).toHaveBeenCalledTimes(1)
      expect(identityProviderMock.generateRedirectUri).toHaveBeenCalledWith()
      expect(result).toEqual({
        authorizationUrl: mockAuthorizationUrl
      })
    })

    it('should return the exact URL from identity provider', () => {
      // arrange
      const expectedUrl = 'https://accounts.google.com/oauth/authorize?client_id=123&redirect_uri=callback&scope=profile email'
      identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue(expectedUrl)

      // act
      const result = generateOAuthRedirectUriUseCase.execute()

      // assert
      expect(result.authorizationUrl).toBe(expectedUrl)
    })

    it('should handle different OAuth provider URLs', () => {
      // arrange
      const testCases = [
        faker.internet.url() + '/oauth/authorize',
        faker.internet.url() + '/auth/facebook',
        faker.internet.url() + '/login/github',
        'https://login.microsoftonline.com/common/oauth2/authorize'
      ]

      testCases.forEach(url => {
        identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue(url)

        // act
        const result = generateOAuthRedirectUriUseCase.execute()

        // assert
        expect(result.authorizationUrl).toBe(url)
        expect(identityProviderMock.generateRedirectUri).toHaveBeenCalledTimes(1)
      })
    })

    it('should work with URLs containing query parameters', () => {
      // arrange
      const baseUrl = faker.internet.url()
      const clientId = faker.string.uuid()
      const redirectUri = faker.internet.url()
      const scope = 'profile email openid'
      const state = faker.string.alphanumeric(16)

      const urlWithParams = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code`

      identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue(urlWithParams)

      // act  
      const result = generateOAuthRedirectUriUseCase.execute()

      // assert
      expect(result.authorizationUrl).toBe(urlWithParams)
      expect(result.authorizationUrl).toContain('client_id=')
      expect(result.authorizationUrl).toContain('redirect_uri=')
      expect(result.authorizationUrl).toContain('scope=')
      expect(result.authorizationUrl).toContain('state=')
    })

    it('should handle empty string URL from provider', () => {
      // arrange
      identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue('')

      // act
      const result = generateOAuthRedirectUriUseCase.execute()

      // assert
      expect(result.authorizationUrl).toBe('')
      expect(identityProviderMock.generateRedirectUri).toHaveBeenCalledTimes(1)
    })

    it('should handle special characters in URL', () => {
      // arrange
      const urlWithSpecialChars = 'https://oauth.provider.com/auth?redirect_uri=https%3A//callback.com%3Fstate%3Dabc123&scope=read%3Auser'
      identityProviderMock.generateRedirectUri = vi.fn().mockReturnValue(urlWithSpecialChars)

      // act
      const result = generateOAuthRedirectUriUseCase.execute()

      // assert
      expect(result.authorizationUrl).toBe(urlWithSpecialChars)
      expect(result.authorizationUrl).toContain('%3A')
      expect(result.authorizationUrl).toContain('%3F')
    })
  })
})