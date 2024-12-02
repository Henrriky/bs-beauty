export const API_VARIABLES = {
  BASE_URL: 'http://localhost:3000/api',
  AUTH_ENDPOINTS: {
    COMPLETE_REGISTER: '/auth/google/redirect-uri',
    FETCH_GOOGLE_REDIRECT_URI: '/auth/google/redirect-uri',
    EXCHANGE_CODE_FOR_TOKEN: '/auth/google/exchange-code',
    LOGIN_WITH_GOOGLE_ACCESS_TOKEN: '/auth/login',
  },
} as const
