export const API_VARIABLES = {
  BASE_URL: 'http://localhost:3000/api',
  AUTH_ENDPOINTS: {
    FETCH_GOOGLE_REDIRECT_URI: '/auth/google/redirect-uri',
    EXCHANGE_CODE_FOR_TOKEN: '/auth/google/exchange-code'
  }
} as const