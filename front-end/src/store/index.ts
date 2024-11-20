import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themes/theme-slice'
import authReducer from './auth/auth-slice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
  },
})
