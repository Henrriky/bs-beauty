/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import * as AuthAPI from '../../api/auth-api'
import { useNavigate } from 'react-router'
import useAppDispatch from '../../hooks/use-app-dispatch'
import { setToken } from '../../store/auth/auth-slice'
import { TokenPayload, decodeUserToken } from '../../utils/decode-token'
import useAppSelector from '../../hooks/use-app-selector'
import { toast } from 'react-toastify'

// https://chatgpt.com/c/673be240-c094-8004-aeaa-c06ca029b0b5
// https://chatgpt.com/c/673bfd94-4bb4-8004-b54b-8f3afe53b047
// https://medium.com/@ravipatel.it/building-a-layout-with-react-router-v6-step-by-step-guide-75b9637f1fbe
function Callback() {
  const dispatchRedux = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
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

    const code = extractAuthorizationCodeFromSearch()
    if (!code) {
      throw new Error('Código de autorização não encontrado')
    }

    AuthAPI.exchangeCodeForToken(code)
      .then(async ({ accessToken: googleAccessToken }) => {
        const { accessToken } =
          await AuthAPI.loginWithGoogleAccessToken(googleAccessToken)

        const decodedToken = decodeUserToken(accessToken)
        storeDecodedTokenOnAuthState(decodedToken, accessToken)
        localStorage.setItem('token', accessToken)
        navigate('/profile')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Erro ao trocar o código')
      })
  }, [])
  return <></>
}

export default Callback
