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
import { roleAPI } from './role/role-api'
import { permissionAPI } from './permission/permission-api'

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
    [roleAPI.reducerPath]: roleAPI.reducer,
    [permissionAPI.reducerPath]: permissionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(userAPI.middleware)
      .concat(serviceAPI.middleware)
      .concat(offerAPI.middleware)
      .concat(customerAPI.middleware)
      .concat(shiftAPI.middleware)
      .concat(professionalAPI.middleware)
      .concat(appointmentAPI.middleware)
      .concat(analyticsAPI.middleware)
      .concat(roleAPI.middleware)
      .concat(permissionAPI.middleware),
})
