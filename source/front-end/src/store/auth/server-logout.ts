import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_VARIABLES } from '../../api/config'
import { logout } from './auth-slice'
import { authAPI } from '../auth/auth-api'

export const serverLogout = createAsyncThunk(
  'auth/serverLogout',
  async (_, { dispatch }) => {
    try {
      await fetch(
        `${API_VARIABLES.BASE_URL}${API_VARIABLES.AUTH_ENDPOINTS.LOGOUT}`,
        { method: 'POST', credentials: 'include' },
      )
    } catch (e) {
      console.warn('[LOGOUT] Error trying to logout:', (e as Error)?.message)
    } finally {
      dispatch(logout())
      dispatch(authAPI.util.resetApiState())
      localStorage.removeItem('token')
      localStorage.removeItem('googleAccessToken')
    }
  },
)
