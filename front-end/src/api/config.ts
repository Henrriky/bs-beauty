export const API_VARIABLES = {
  BASE_URL: 'http://localhost:3000/api',
  AUTH_ENDPOINTS: {
    COMPLETE_REGISTER: '/auth/register/complete',
    FETCH_GOOGLE_REDIRECT_URI: '/auth/google/redirect-uri',
    EXCHANGE_CODE_FOR_TOKEN: '/auth/google/exchange-code',
    LOGIN_WITH_GOOGLE_ACCESS_TOKEN: '/auth/login',
    FETCH_USER_INFO: '/auth/user',
  },
  USER_ENDPOINTS: {
    UPDATE_PROFILE: '/customer/profile',
  },
  EMPLOYEE_ENDPOINTS: '/employees',
  SHIFT_ENDPOINTS: {
    CREATE_AND_UPDATE: '/shifts',
    FETCH_FROM_EMPLOYEE: '/shifts/employee',
  },

} as const
