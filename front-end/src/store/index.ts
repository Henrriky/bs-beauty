import themeReducer, { themeSlice } from './themes/theme-slice'
import authReducer, { authSlice } from './auth/auth-slice'
import { authAPI } from './auth/auth-api'
import { configureStore } from '@reduxjs/toolkit'
import { userAPI } from './user/user-api'
import { serviceAPI } from './service/service-api'
import { customerAPI } from './customer/customer-api'

export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeReducer,
    [authSlice.name]: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [serviceAPI.reducerPath]: serviceAPI.reducer,
    [customerAPI.reducerPath]: customerAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(userAPI.middleware)
      .concat(serviceAPI.middleware)
      .concat(customerAPI.middleware),
})
