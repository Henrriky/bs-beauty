interface OAuthIdentityProvider {
  fetchEmailAndUserIdFromToken: (token: string) => Promise<{ userId: string, email: string }>
  generateRedirectUri: () => string
}

export type { OAuthIdentityProvider }
