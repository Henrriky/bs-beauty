interface OAuthIdentityProvider {
  fetchEmailAndUserIdFromToken: (token: string) => Promise<{ userId: string, email: string }>
  generateRedirectUri: () => string
  exchangeCodeByToken: (code: string) => Promise<{ accessToken: string }>
}

export type { OAuthIdentityProvider }
