import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { API_VARIABLES } from '../../api/config'
import { RootState } from '../../hooks/use-app-selector'
import { ResponseWithErrorBody } from './types'
import { AppErrorCodes } from './errors/app-error-codes'
import { Mutex } from 'async-mutex'
import { setToken, logout } from '../auth/auth-slice'
import { decodeUserToken } from '../../utils/decode-token'

const EXPIRY_SKEW_MS = 30_000
const refreshMutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: API_VARIABLES.BASE_URL,
  credentials: 'include',
  prepareHeaders(headers, { getState }) {
    const state = getState() as RootState
    const accessToken = state.auth.token?.accessToken
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
    return headers
  },
})

async function refreshAccessToken(api: any, extraOptions: any): Promise<string | null> {
  console.log('[AUTH] Chamando endpoint de refresh...')
  const response = await baseQuery(
    { url: API_VARIABLES.AUTH_ENDPOINTS.NEW_TOKENS, method: 'POST' },
    api,
    extraOptions
  )

  const accessToken = (response.data as any)?.accessToken as string | undefined
  if (accessToken) {
    console.log('[AUTH] Refresh bem-sucedido, novo token recebido')
    return accessToken
  }

  console.warn('[AUTH] Refresh falhou — nenhum accessToken retornado')
  return null
}

async function ensureValidAccessToken(api: any, extraOptions: any) {
  const stateBefore = api.getState() as RootState
  const tokenBefore = selectAuthToken(stateBefore)

  if (!isTokenMissingOrExpiring(tokenBefore)) return

  console.log('[AUTH] Token ausente ou prestes a expirar, iniciando refresh...')

  if (!refreshMutex.isLocked()) {
    const release = await refreshMutex.acquire()
    try {
      const stateNow = api.getState() as RootState
      const tokenNow = selectAuthToken(stateNow)
      if (!isTokenMissingOrExpiring(tokenNow)) {
        console.log('[AUTH] Outro fluxo já atualizou o token, seguindo...')
        return
      }

      const newAccessToken = await refreshAccessToken(api, extraOptions)
      if (newAccessToken) {
        dispatchNewTokens(api, newAccessToken)
      } else {
        console.warn('[AUTH] Refresh falhou, deslogando...')
        api.dispatch(logout())
      }
    } finally {
      release()
    }
  } else {
    console.log('[AUTH] Refresh já em andamento, aguardando...')
    await refreshMutex.waitForUnlock()
  }
}

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await ensureValidAccessToken(api, extraOptions)

  let result = await baseQuery(args, api, extraOptions)

  const initialStatus =
    (result.error as FetchBaseQueryError | undefined)?.status ??
    result.meta?.response?.status

  if (initialStatus === 401) {
    console.warn('[AUTH] Recebeu 401, tentando refresh on-demand...')
    if (!refreshMutex.isLocked()) {
      const release = await refreshMutex.acquire()
      try {
        const newAccessToken = await refreshAccessToken(api, extraOptions)
        if (newAccessToken) {
          dispatchNewTokens(api, newAccessToken)
          console.log('[AUTH] Reenviando request original após refresh...')
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.warn('[AUTH] Refresh falhou no 401, deslogando...')
          api.dispatch(logout())
        }
      } finally {
        release()
      }
    } else {
      console.log('[AUTH] Já existe um refresh em andamento, aguardando...')
      await refreshMutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  const finalStatus =
    (result.error as FetchBaseQueryError | undefined)?.status ??
    result.meta?.response?.status

  const error = result.error as FetchBaseQueryError | undefined
  if (error && finalStatus === 401) {
    console.warn('[AUTH] Ainda 401 após refresh, aplicando redirecionamento...')
    const code = (error.data as ResponseWithErrorBody | undefined)?.errors
    switch (code) {
      case AppErrorCodes.TOKEN_INVALID:
      case AppErrorCodes.ROLE_NON_EXISTENT:
        window.location.href = '/'
        break
      case AppErrorCodes.ROLE_INSUFFICIENT:
        window.location.href = '/home'
        break
      default:
        break
    }
  }

  return result
}

function dispatchNewTokens(api: any, accessToken: string) {
  const payload = decodeUserToken(accessToken)
  const currentState = api.getState() as RootState
  const currentGoogleToken = currentState.auth.token?.googleAccessToken

  console.log('[AUTH] Salvando novo token no estado, exp:', payload.exp)

  api.dispatch(
    setToken({
      token: {
        accessToken,
        expiresAt: payload.exp!,
        googleAccessToken: currentGoogleToken,
      },
      user: { ...payload },
    })
  )
}

function selectAuthToken(state: RootState) {
  return state.auth.token
}

function isTokenMissingOrExpiring(token: RootState['auth']['token']): boolean {
  if (!token?.accessToken) return true
  if (!token.expiresAt) return true
  const expiresAtMs = token.expiresAt * 1000
  return expiresAtMs <= Date.now() + EXPIRY_SKEW_MS
}


export { baseQueryWithAuth }
