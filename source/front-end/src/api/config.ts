import ENV from '../config/config'

export const API_VARIABLES = {
  BASE_URL:
    ENV.ENVIRONMENT === 'dev' ? `http://localhost:${ENV.PORT}/api` : '/api',
  AUTH_ENDPOINTS: {
    COMPLETE_REGISTER: '/auth/register/complete',
    FETCH_GOOGLE_REDIRECT_URI: '/auth/google/redirect-uri',
    EXCHANGE_CODE_FOR_TOKEN: '/auth/google/exchange-code',
    LOGIN_WITH_GOOGLE_ACCESS_TOKEN: '/auth/login',
    FETCH_USER_INFO: '/auth/user',
    REGISTER_USER: '/auth/register',
    NEW_TOKENS: '/auth/new-tokens',
    CODE_VALIDATION: '/auth/code-validation',
    REQUEST_PASSWORD_RESET: '/auth/password-reset/request',
    SET_NEW_PASSWORD: '/auth/password-reset/set-password',
    LOGOUT: '/auth/logout',
  },
  USER_ENDPOINTS: {
    UPDATE_CUSTOMER_PROFILE: '/customers',
    UPDATE_PROFESSIONAL_PROFILE: '/professionals',
  },
  CUSTOMERS_ENDPOINTS: {
    FETCH_CUSTOMERS: '/customers',
    FIND_CUSTOMER_BY_ID: (customerId: string) => `/customers/${customerId}`,
  },
  SERVICES_ENDPOINTS: {
    ENDPOINT: '/services',
    FETCH_PROFESSIONALS_OFFERING_SERVICE: (serviceId: string) =>
      `/services/${serviceId}/offer/professionals`,
  },
  OFFERS_ENDPOINTS: {
    ENDPOINT: '/offers',
    FETCH_FOR_AVAILABLE_SCHEDULES_FROM_PROFESSIONAL_OFFER: (
      serviceOfferedId: string,
      dayToFetchAvailableSchedulling: string,
    ) =>
      `/offers/${serviceOfferedId}/schedulling?dayToFetchAvailableSchedulling=${encodeURIComponent(dayToFetchAvailableSchedulling)}`,
  },
  SHIFTS_ENDPOINTS: {
    ENDPOINT: '/shifts',
    FIND_SHIFTS_BY_PROFESSIONAL: (professionalId: string) =>
      `/shifts/professional/${professionalId}`,
    UPDATE_SHIFT: (shiftId: string) => `/shifts/${shiftId}`,
  },
  PROFESSIONALS_ENDPOINTS: {
    FETCH_PROFESSIONALS: '/professionals',
    CREATE_PROFESSIONAL: '/professionals',
    DELETE_PROFESSIONAL: (professionalId: string) =>
      `/professionals/${professionalId}`,
    FETCH_SERVICES_OFFERED_BY_PROFESSIONAL: (professionalId: string) =>
      `/professionals/${professionalId}/offers/service`,
    FETCH_PROFESSIONAL_ROLES: (professionalId: string) =>
      `/professionals/${professionalId}/roles`,
    ADD_ROLE_TO_PROFESSIONAL: (professionalId: string) =>
      `/professionals/${professionalId}/roles`,
    REMOVE_ROLE_FROM_PROFESSIONAL: (professionalId: string) =>
      `/professionals/${professionalId}/roles`,
  },
  APPOINTMENTS_ENDPOINTS: {
    CREATE_APPOINTMENT: '/appointments',
    ASSOCIATE_APPOINTMENT_WITH_OFFER: '/appointments',
    FETCH_CUSTOMER_APPOINTMENTS: '/appointments/customer',
    FIND_BY_SERVICE_OFFERED: (serviceOfferedId: string) =>
      `/appointments/offer/${serviceOfferedId}`,
    FIND_APPOINTMENT_BY_ID: (appointmentId: string) =>
      `/appointments/${appointmentId}`,
    UPDATE_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}`,
    FINISH_APPOINTMENT: (appointmentId: string) =>
      `/appointments/${appointmentId}/finish`,
  },
  RATINGS_ENDPOINTS: {
    FIND_BY_RATING_ID: (ratingId: string) => `/ratings/${ratingId}`,
    UPDATE_RATING: (ratingId: string) => `/ratings/${ratingId}`,
  },
  ANALYTICS_ENDPOINTS: {
    FETCH_ANALYTICS: '/analytics',
    FETCH_ANALYTICS_BY_PROFESSIONAL: (professionalId: string) =>
      `/analytics/${professionalId}`,
    FETCH_RATINGS_ANALYTICS: '/public-analytics/ratings',
  },
  NOTIFICATIONS_ENDPOINTS: {
    FETCH_NOTIFICATIONS: '/notifications',
    MARK_MANY_AS_READ: '/notifications/read',
  },
  NOTIFICATION_TEMPLATES_ENDPOINTS: {
    FETCH_NOTIFICATION_TEMPLATES: '/notification-templates',
    UPDATE_NOTIFICATION_TEMPLATE: (key: string) => `/notification-templates/${key}`
  },
  ROLES_ENDPOINTS: {
    ENDPOINT: '/roles',
    FIND_BY_ID: (id: string) => `/roles/${id}`,
    UPDATE_ROLE: (id: string) => `/roles/${id}`,
    DELETE_ROLE: (id: string) => `/roles/${id}`,
    ASSOCIATIONS: (id: string) => `/roles/${id}/associations`,
    ADD_PERMISSION: (id: string) => `/roles/${id}/permissions`,
    REMOVE_PERMISSION: (id: string) => `/roles/${id}/permissions`,
  },
  PERMISSIONS_ENDPOINTS: {
    ENDPOINT: '/permissions',
  },
} as const
