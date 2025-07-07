interface OAuthIdentityProvider {
  fetchUserInformationsFromToken: (token: string) => Promise<{ userId: string, email: string, profilePhotoUrl: string }>
  generateRedirectUri: () => string
  exchangeCodeByToken: (code: string) => Promise<{ accessToken: string }>
}

export type { OAuthIdentityProvider }
