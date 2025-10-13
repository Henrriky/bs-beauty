import { useEffect, useState, useRef } from 'react'
import { decodeUserToken } from './utils/decode-token'
import useAppDispatch from './hooks/use-app-dispatch'
import { API_VARIABLES } from './api/config'
import { logout, setToken } from './store/auth/auth-slice'

function isExpired(accessToken: string): boolean {
  try {
    const decoded = decodeUserToken(accessToken)
    return decoded.exp! * 1000 <= Date.now()
  } catch {
    return true
  }
}

export default function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const [ready, setReady] = useState(false)
  const triedRef = useRef(false)

  useEffect(() => {
    if (triedRef.current) return
    triedRef.current = true

    const localToken = localStorage.getItem('token')

    if (localToken && !isExpired(localToken)) {
      setReady(true)
      return
    }

    (async () => {
      try {
        const res = await fetch(
          `${API_VARIABLES.BASE_URL}${API_VARIABLES.AUTH_ENDPOINTS.NEW_TOKENS}`,
          { method: 'POST', credentials: 'include' }
        )

        if (!res.ok) {
          dispatch(logout())
          setReady(true)
          return
        }

        const data = await res.json()
        const accessToken: string | undefined = data?.accessToken

        if (!accessToken) {
          dispatch(logout())
          setReady(true)
          return
        }

        const payload = decodeUserToken(accessToken)

        dispatch(
          setToken({
            token: {
              accessToken,
              expiresAt: payload.exp!,
              googleAccessToken: localStorage.getItem('googleAccessToken') ?? undefined,
            },
            user: { ...payload },
          })
        )
      } catch (e) {
        dispatch(logout())
      } finally {
        setReady(true)
      }
    })()
  }, [dispatch])

  if (!ready) {
    return <div style={{ padding: 24, color: '#ddd' }}>Checando sessão…</div>
  }

  return <>{children}</>
}
