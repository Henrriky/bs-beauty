import { useEffect, useState } from 'react'
import googleIcon from '../assets/google.svg'
import loginBackgroundBottom from '../assets/login-background-bottom.svg'
import loginBackgroundTop from '../assets/login-background-top.svg'
import * as AuthAPI from '../api/auth-api'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import useAppDispatch from '../hooks/use-app-dispatch'
import { setToken } from '../store/auth/auth-slice'


interface AuthState {
  isLoading: boolean;
  error: string | null;
}

function LoginPage() {

    const dispatchRedux = useAppDispatch()
    const [authState, setAuthState] = useState<AuthState>({ isLoading: true, error: null })

    const navigate = useNavigate();


    const extractAuthorizationCodeFromSearch = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      return code
    }

    useEffect(() => {

      const code = extractAuthorizationCodeFromSearch()
      if (!code) {
        throw new Error('Código de autorização não encontrado')
      }

      AuthAPI.exchangeCodeForToken(code)
        .then(({ accessToken }) => {

          //TODO: Armazenar o accessToken na Slice do usuario
          dispatchRedux(setToken({
            user: {
              role: "MANAGER",
              
            },
            token: {
              accessToken,
              expiresAt: 1
            }
          }))


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

    async function handleButtonClick () {
        try {
            const { authorizationUrl }  = await AuthAPI.fetchGoogleRedirectUri()
            window.location.href = authorizationUrl
        } catch (error) {
            console.error(error)
            setError('Erro ao buscar a URL de Autenticação')
        }
    }

    return (
        <>
            <div className='flex justify-center items-center h-screen flex-col relative'>
                <img src={loginBackgroundTop} alt="Ícone do Google" className='absolute right-0 top-0'/>
                <div>
                    { error && <p className='text-red-400'>{error}</p>}
                    <button 
                        onClick={handleButtonClick}
                        className="flex justify-center items-center gap-2.5 bg-[#DBDBDB] p-2 rounded w-[320px] text-[#1E1E1E] text-sm font-medium rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm"
                    >
                        <img src={googleIcon} alt="Ícone do Google" />
                        Logar com o Google
                    </button>
                </div>

                <img src={loginBackgroundBottom} alt="Ícone do Google" className='absolute left-0 bottom-0 max-h- object-cover w-full'/>
            </div>
        </>
    )
}

export default LoginPage