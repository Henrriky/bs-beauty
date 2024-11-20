import { useEffect, useState } from 'react'
import * as AuthAPI from '../api/auth-api'
import { useNavigate } from 'react-router'
import useAppDispatch from '../hooks/use-app-dispatch'
import { setToken } from '../store/auth/auth-slice'
import { TokenPayload, decodeUserToken } from '../utils/decode-token'

interface AuthState {
  isLoading: boolean
  error: string | null
}
// https://chatgpt.com/c/673be240-c094-8004-aeaa-c06ca029b0b5
// https://chatgpt.com/c/673bfd94-4bb4-8004-b54b-8f3afe53b047
// https://medium.com/@ravipatel.it/building-a-layout-with-react-router-v6-step-by-step-guide-75b9637f1fbe
function Callback() {
  const dispatchRedux = useAppDispatch()
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    error: null,
  })

  const navigate = useNavigate()

  const extractAuthorizationCodeFromSearch = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    return code
  }

  const storeDecodedTokenOnAuthState = (
    decodedToken: TokenPayload,
    accessToken: string,
  ) => {
    dispatchRedux(
      setToken({
        user: {
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
          registerCompleted: decodedToken.registerCompleted,
        },
        token: {
          accessToken,
          expiresAt: decodedToken.exp!,
        },
      }),
    )
  }

  useEffect(() => {
    const code = extractAuthorizationCodeFromSearch()
    if (!code) {
      throw new Error('Código de autorização não encontrado')
    }

    AuthAPI.exchangeCodeForToken(code)
      .then(({ accessToken }) => {
        const decodedToken = decodeUserToken(accessToken)
        storeDecodedTokenOnAuthState(decodedToken, accessToken)
        if (decodedToken.registerCompleted) {
        }
        // localStorage.setItem('token', accessToken)
        // navigate('/home')
      })
      .catch((error) => {
        console.error(error)
        setAuthState({
          isLoading: false,
          error: 'Erro ao trocar o código',
        })
      })
      .finally(() => {
        setAuthState({
          ...authState,
          isLoading: false,
        })
      })
  }, [])
  return (
    <>{authState.error && <p className="text-red-400">{authState.error}</p>}</>
  )
}

export default Callback
