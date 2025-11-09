import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GoogleAuthIdentityProvider } from '@/services/identity-providers/google-oauth-identity-provider.service'
import { oauth2Client } from '@/lib/google'
import { ENV } from '@/config/env'

vi.mock('@/lib/google', () => ({
  oauth2Client: {
    getTokenInfo: vi.fn(),
    request: vi.fn(),
    getToken: vi.fn(),
    setCredentials: vi.fn(),
    generateAuthUrl: vi.fn()
  }
}))

vi.mock('@/config/env', () => ({
  ENV: {
    GOOGLE_SCOPES: 'https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email',
    GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/google/callback'
  }
}))

describe('GoogleAuthIdentityProvider', () => {
  let googleAuthProvider: GoogleAuthIdentityProvider

  beforeEach(() => {
    googleAuthProvider = new GoogleAuthIdentityProvider()
    vi.clearAllMocks()
  })

  describe('fetchUserInformationsFromToken', () => {
    it('should fetch user information successfully', async () => {
      const mockTokenInfo = {
        email: 'user@example.com',
        sub: 'google-user-id-123',
        scope: 'profile email'
      }

      const mockUserInfo = {
        picture: 'https://example.com/photo.jpg'
      }

      vi.mocked(oauth2Client.getTokenInfo).mockResolvedValue(mockTokenInfo as any)
      vi.mocked(oauth2Client.request).mockResolvedValue({
        data: mockUserInfo
      } as any)

      const result = await googleAuthProvider.fetchUserInformationsFromToken('valid-token')

      expect(result).toEqual({
        userId: 'google-user-id-123',
        email: 'user@example.com',
        profilePhotoUrl: 'https://example.com/photo.jpg'
      })

      expect(oauth2Client.setCredentials).toHaveBeenCalledWith({
        access_token: 'valid-token'
      })

      expect(oauth2Client.getTokenInfo).toHaveBeenCalledWith('valid-token')

      expect(oauth2Client.request).toHaveBeenCalledWith({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        headers: {
          Authorization: 'Bearer valid-token'
        }
      })
    })

    it('should throw error when email is missing from token', async () => {
      const mockTokenInfo = {
        sub: 'google-user-id-123',
        scope: 'profile'
      }

      vi.mocked(oauth2Client.getTokenInfo).mockResolvedValue(mockTokenInfo as any)

      await expect(
        googleAuthProvider.fetchUserInformationsFromToken('token-without-email')
      ).rejects.toThrow('Email or user id not exists on google token')
    })

    it('should throw error when userId (sub) is missing from token', async () => {
      const mockTokenInfo = {
        email: 'user@example.com',
        scope: 'email'
      }

      vi.mocked(oauth2Client.getTokenInfo).mockResolvedValue(mockTokenInfo as any)

      await expect(
        googleAuthProvider.fetchUserInformationsFromToken('token-without-sub')
      ).rejects.toThrow('Email or user id not exists on google token')
    })

    it('should throw error when profile photo is missing from user info', async () => {
      const mockTokenInfo = {
        email: 'user@example.com',
        sub: 'google-user-id-123'
      }

      const mockUserInfo = {
        name: 'John Doe'
      }

      vi.mocked(oauth2Client.getTokenInfo).mockResolvedValue(mockTokenInfo as any)
      vi.mocked(oauth2Client.request).mockResolvedValue({
        data: mockUserInfo
      } as any)

      await expect(
        googleAuthProvider.fetchUserInformationsFromToken('token-without-photo')
      ).rejects.toThrow('Profile photo url not exists on google user info')
    })

    it('should handle complete user information', async () => {
      const mockTokenInfo = {
        email: 'complete@example.com',
        sub: 'complete-user-id',
        email_verified: true,
        scope: 'profile email'
      }

      const mockUserInfo = {
        picture: 'https://lh3.googleusercontent.com/a/photo.jpg',
        name: 'Complete User',
        given_name: 'Complete',
        family_name: 'User'
      }

      vi.mocked(oauth2Client.getTokenInfo).mockResolvedValue(mockTokenInfo as any)
      vi.mocked(oauth2Client.request).mockResolvedValue({
        data: mockUserInfo
      } as any)

      const result = await googleAuthProvider.fetchUserInformationsFromToken('complete-token')

      expect(result).toEqual({
        userId: 'complete-user-id',
        email: 'complete@example.com',
        profilePhotoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg'
      })
    })
  })

  describe('exchangeCodeByToken', () => {
    it('should exchange authorization code for access token', async () => {
      const mockTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        scope: 'profile email',
        token_type: 'Bearer',
        expiry_date: Date.now() + 3600000
      }

      vi.mocked(oauth2Client.getToken).mockResolvedValue({
        tokens: mockTokens
      } as any)

      const result = await googleAuthProvider.exchangeCodeByToken('auth-code-123')

      expect(result).toEqual({
        accessToken: 'new-access-token'
      })

      expect(oauth2Client.getToken).toHaveBeenCalledWith('auth-code-123')
      expect(oauth2Client.setCredentials).toHaveBeenCalledWith(mockTokens)
    })

    it('should throw error when access_token is missing', async () => {
      const mockTokens = {
        refresh_token: 'refresh-token',
        scope: 'profile email'
      }

      vi.mocked(oauth2Client.getToken).mockResolvedValue({
        tokens: mockTokens
      } as any)

      await expect(
        googleAuthProvider.exchangeCodeByToken('invalid-code')
      ).rejects.toThrow('Error trying to exchange code by token: access_token property null or undefined')
    })

    it('should handle token exchange with all properties', async () => {
      const mockTokens = {
        access_token: 'full-access-token',
        refresh_token: 'full-refresh-token',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        token_type: 'Bearer',
        expiry_date: 1234567890000
      }

      vi.mocked(oauth2Client.getToken).mockResolvedValue({
        tokens: mockTokens
      } as any)

      const result = await googleAuthProvider.exchangeCodeByToken('full-auth-code')

      expect(result.accessToken).toBe('full-access-token')
    })

    it('should throw error when access_token is undefined', async () => {
      const mockTokens = {
        access_token: undefined,
        refresh_token: 'refresh-token'
      }

      vi.mocked(oauth2Client.getToken).mockResolvedValue({
        tokens: mockTokens
      } as any)

      await expect(
        googleAuthProvider.exchangeCodeByToken('code-with-undefined-token')
      ).rejects.toThrow('access_token property null or undefined')
    })
  })

  describe('generateRedirectUri', () => {
    it('should generate authorization URL with correct parameters', () => {
      const mockAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?scope=profile+email&redirect_uri=http://localhost:3000/auth/google/callback'

      vi.mocked(oauth2Client.generateAuthUrl).mockReturnValue(mockAuthUrl)

      const result = googleAuthProvider.generateRedirectUri()

      expect(result).toBe(mockAuthUrl)

      expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith({
        access_type: 'offline',
        scope: ENV.GOOGLE_SCOPES.split(','),
        include_granted_scopes: true,
        redirect_uri: ENV.GOOGLE_REDIRECT_URI
      })
    })

    it('should use environment variables for scopes and redirect URI', () => {
      const expectedScopes = ENV.GOOGLE_SCOPES.split(',')

      vi.mocked(oauth2Client.generateAuthUrl).mockReturnValue('mock-url')

      googleAuthProvider.generateRedirectUri()

      expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: expectedScopes,
          redirect_uri: ENV.GOOGLE_REDIRECT_URI
        })
      )
    })

    it('should set access_type to offline', () => {
      vi.mocked(oauth2Client.generateAuthUrl).mockReturnValue('mock-url')

      googleAuthProvider.generateRedirectUri()

      expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          access_type: 'offline'
        })
      )
    })

    it('should include granted scopes', () => {
      vi.mocked(oauth2Client.generateAuthUrl).mockReturnValue('mock-url')

      googleAuthProvider.generateRedirectUri()

      expect(oauth2Client.generateAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          include_granted_scopes: true
        })
      )
    })
  })
})
