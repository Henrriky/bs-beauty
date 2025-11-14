import { store } from '../../store'
import { API_VARIABLES } from '../../api/config'
import { decodeUserToken } from '../decode-token'
import { setToken } from '../../store/auth/auth-slice'
import { authAPI } from '../../store/auth/auth-api'

type AppDispatch = typeof store.dispatch

export async function refreshUserToken(dispatch: AppDispatch): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_VARIABLES.BASE_URL}${API_VARIABLES.AUTH_ENDPOINTS.NEW_TOKENS}`,
      { method: 'POST', credentials: 'include' },
    )

    if (!res.ok) {
      return false
    }

    const data = await res.json()
    const accessToken: string | undefined = data?.accessToken

    if (!accessToken) {
      return false
    }

    const payload = decodeUserToken(accessToken)

    dispatch(
      setToken({
        token: {
          accessToken,
          expiresAt: payload.exp!,
          googleAccessToken:
            localStorage.getItem('googleAccessToken') ?? undefined,
        },
        user: { ...payload },
      }),
    )

    dispatch(authAPI.util.invalidateTags(['User']))
    return true
  } catch (error) {
    console.error('[refreshUserToken] Error refreshing token:', error)
    return false
  }
}
