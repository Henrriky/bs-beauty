import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { decodeUserToken } from '../../utils/decode-token'
import { CustomerOrEmployee } from './types'

type TokenParams = {
  accessToken: string
  googleAccessToken?: string
  expiresAt: number
}

type AuthState = {
  token: TokenParams | null
  user: CustomerOrEmployee | null
}

const initialState = (): AuthState => {
  const accessToken = localStorage.getItem('token')
  const googleAccessToken = localStorage.getItem('googleAccessToken')

  if (!accessToken || !googleAccessToken) {
    console.warn(
      'Access token or Google Access Token from localStorage not found',
    )

    return {
      token: null,
      user: null,
    }
  }

  const tokenInformations = decodeUserToken(accessToken)

  const tokenIsExpired = tokenInformations.exp! * 1000 < Date.now()

  if (tokenIsExpired) {
    // TODO: Add toast info that token expire
    // TODO: If Provider not work redirect user to /login with window.location.href
    console.warn('Access token expired')
    return {
      token: null,
      user: null,
    }
  }

  return {
    token: {
      googleAccessToken,
      accessToken,
      expiresAt: tokenInformations.exp!,
    },
    user: {
      ...tokenInformations,
    },
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ token: TokenParams; user: CustomerOrEmployee }>,
    ) => {
      localStorage.setItem('token', action.payload.token.accessToken)
      if (action.payload.token.googleAccessToken) {
        localStorage.setItem('googleAccessToken', action.payload.token.googleAccessToken)
      }
      return {
        ...state,
        ...action.payload,
      }
    },
    logout: () => {
      return {
        user: null,
        token: null,
      }
    },
    setRegisterCompleted: (state) => {
      if (state.user) {
        state.user.registerCompleted = true
      }
    },
    updateUserInformations: (
      state,
      action: PayloadAction<{ user: Partial<CustomerOrEmployee> }>,
    ) => {
      return {
        ...state,
        ...action.payload.user,
      }
    },
  },
})

export { authSlice }
export type { TokenParams }
export const {
  setToken,
  setRegisterCompleted,
  logout,
  updateUserInformations,
} = authSlice.actions
export default authSlice.reducer
