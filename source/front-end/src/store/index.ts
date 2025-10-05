import themeReducer, { themeSlice } from './themes/theme-slice'
import authReducer, { authSlice } from './auth/auth-slice'
import { authAPI } from './auth/auth-api'
import { configureStore } from '@reduxjs/toolkit'
import { userAPI } from './user/user-api'
import { serviceAPI } from './service/service-api'
import { customerAPI } from './customer/customer-api'
import { offerAPI } from './offer/offer-api'
import { shiftAPI } from './shift/shift-api'
import { professionalAPI } from './professional/professional-api'
import { appointmentAPI } from './appointment/appointment-api'
import { analyticsAPI } from './analytics/analytics-api'
import { notificationAPI } from './notification/notification-api'
import { ratingAPI } from './rating/rating-api'

export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeReducer,
    [authSlice.name]: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [customerAPI.reducerPath]: customerAPI.reducer,
    [offerAPI.reducerPath]: offerAPI.reducer,
    [shiftAPI.reducerPath]: shiftAPI.reducer,
    [professionalAPI.reducerPath]: professionalAPI.reducer,
    [appointmentAPI.reducerPath]: appointmentAPI.reducer,
    [analyticsAPI.reducerPath]: analyticsAPI.reducer,
    [notificationAPI.reducerPath]: notificationAPI.reducer,
    [ratingAPI.reducerPath]: ratingAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(userAPI.middleware)
      .concat(serviceAPI.middleware)
      .concat(customerAPI.middleware)
      .concat(offerAPI.middleware)
      .concat(shiftAPI.middleware)
      .concat(professionalAPI.middleware)
      .concat(appointmentAPI.middleware)
      .concat(analyticsAPI.middleware)
      .concat(notificationAPI.middleware)
      .concat(ratingAPI.middleware),
})
