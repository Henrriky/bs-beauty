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
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    console.error('Access token from localstorage not found')

    return {
      token: null,
      user: null,
    }
  }

  const tokenInformations = decodeUserToken(accessToken)
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
      localStorage.setItem('accessToken', action.payload.token.accessToken)
      return {
        ...state,
        ...action.payload,
      }
    },
  },
})

export const { setToken } = authSlice.actions

export default authSlice.reducer
