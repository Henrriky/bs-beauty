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
      dayToFetchAvailableSchedulling: string,
    ) =>
      `/offers/${serviceOfferedId}/schedulling?dayToFetchAvailableSchedulling=${encodeURIComponent(dayToFetchAvailableSchedulling)}`,
  },
  SHIFTS_ENDPOINTS: {
    ENDPOINT: '/shifts',
    FIND_SHIFTS_BY_EMPLOYEE: (employeeId: string) =>
      `/shifts/employee/${employeeId}`,
  },
  APPOINTMENTS_ENDPOINTS: {
    CREATE_APPOINTMENT: '/appointments',
    ASSOCIATE_APPOINTMENT_WITH_OFFER: '/appointment-services',
    FETCH_CUSTOMER_APPOINTMENTS: '/appointment-services/customer',
  },
} as const
