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
    UPDATE_CUSTOMER_PROFILE: '/customers',
    UPDATE_EMPLOYEE_PROFILE: '/employees',
  },
  CUSTOMERS_ENDPOINTS: {
    FETCH_CUSTOMERS: '/customers',
  },
  SERVICES_ENDPOINTS: {
    ENDPOINT: '/services',
  },
  OFFERS_ENDPOINTS: {
    ENDPOINT: '/offers',
  },
  EMPLOYEE_ENDPOINTS: {
    FETCH_EMPLOYEES: '/employees',
  },
  SHIFT_ENDPOINTS: {
    FETCH_CREATE_AND_UPDATE: '/shifts',
  },

} as const
