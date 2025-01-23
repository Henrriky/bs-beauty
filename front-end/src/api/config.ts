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
    FETCH_EMPLOYEES_OFFERING_SERVICE: (serviceId: string) =>
      `/services/${serviceId}/offer/employees`,
  },
  OFFERS_ENDPOINTS: {
    ENDPOINT: '/offers',
    FETCH_FOR_AVAILABLE_SCHEDULES_FROM_EMPLOYEE_OFFER: (
      serviceOfferedId: string,
    ) => `/offers/${serviceOfferedId}/scheduling`,
  },
  SHIFTS_ENDPOINTS: {
    ENDPOINT: '/shifts',
    FIND_SHIFTS_BY_EMPLOYEE: (employeeId: string) =>
      `/shifts/employee/${employeeId}`,
    UPDATE_SHIFT: (shiftId: string) => `/shifts/${shiftId}`,
  },
  EMPLOYEES_ENDPOINTS: {
    FETCH_EMPLOYEES: '/employees',
    CREATE_EMPLOYEE: '/employees',
    DELETE_EMPLOYEE: (employeeId: string) => `/employees/${employeeId}`,
  },
} as const
