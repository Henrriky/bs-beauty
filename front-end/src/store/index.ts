import themeReducer, { themeSlice } from './themes/theme-slice'
import authReducer, { authSlice } from './auth/auth-slice'
import { authAPI } from './auth/auth-api'
import { configureStore } from '@reduxjs/toolkit'
import { userAPI } from './user/user-api'

export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeReducer,
    [authSlice.name]: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(userAPI.middleware),
})