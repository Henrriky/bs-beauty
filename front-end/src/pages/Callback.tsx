import { useEffect, useState } from 'react'
import googleIcon from '../assets/google.svg'
import loginBackgroundBottom from '../assets/login-background-bottom.svg'
import loginBackgroundTop from '../assets/login-background-top.svg'
import * as AuthAPI from '../api/auth-api'
import { useNavigate } from 'react-router'
import useAppDispatch from '../hooks/use-app-dispatch'
import { setToken } from '../store/auth/auth-slice'
import { TokenPayload, decodeUserToken } from '../utils/decode-token'


interface AuthState {
  isLoading: boolean;
  error: string | null;
}

function Callback() {

    const dispatchRedux = useAppDispatch()
    const [authState, setAuthState] = useState<AuthState>({ isLoading: true, error: null })

    const navigate = useNavigate();

    const extractAuthorizationCodeFromSearch = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      return code
    }

    const storeDecodedTokenOnAuthState = (decodedToken: TokenPayload, accessToken: string) => {
      dispatchRedux(setToken({
        user: {
          role: decodedToken.role,
          email: decodedToken.email,
          name: decodedToken.name,
          registerCompleted: decodedToken.registerCompleted
        },
        token: {
          accessToken,
          expiresAt: decodedToken.exp!
        }
      }))
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
          });
        })
        .finally(() => {
          setAuthState({
            ...authState,
            isLoading: false
          });
        })
    }, [])
    return (
        <>
          { authState.error && <p className='text-red-400'>{authState.error}</p>}
        </>
    )
}

export default Callback