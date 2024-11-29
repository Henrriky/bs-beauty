import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { decodeUserToken } from '../../utils/decode-token'
import { CustomerOrEmployee } from './types'

type TokenParams = {
  accessToken: string
  expiresAt: number
}

type AuthState = {
  token: TokenParams | null
  user: CustomerOrEmployee | null
}

const initialState = (): AuthState => {
  const accessToken = localStorage.getItem('token')

  if (!accessToken) {
    console.warn('Access token from localStorage not found')

    return {
      token: null,
      user: null,
    }
  }

  const tokenInformations = decodeUserToken(accessToken)

  const tokenIsExpired = tokenInformations.exp! * 1000 < Date.now()

  if (tokenIsExpired) {
    //TODO: Add toast info that token expire
    //TODO: If Provider not work redirect user to /login with window.location.href
    console.warn('Access token expired')
    return {
      token: null,
      user: null,
    }
  }

  return {
    token: {
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
      return {
        ...state,
        ...action.payload,
      }
    },
    setRegisterCompleted: (
      state,
    ) => {
      if (state.user) {
        state.user.registerCompleted = true 
      }
    }
  },
})

export { authSlice }
export const { setToken, setRegisterCompleted } = authSlice.actions
export default authSlice.reducer
