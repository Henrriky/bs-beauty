import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import * as AuthAPI from '../../api/auth-api'
import googleIcon from '../../assets/google.svg'
import loginBackgroundBottom from '../../assets/login-background-bottom.svg'
import loginBackgroundTop from '../../assets/login-background-top.svg'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import LoginWithEmailAndPasswordForm from './components/LoginWithEmailAndPasswordForm'

function Login() {
  const navigate = useNavigate()
  const authInformations = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (authInformations.token?.accessToken) {
      if (authInformations.user?.registerCompleted) {
        navigate(
          `/${authInformations.user.userType.toString().toLowerCase()}/home`,
        )
      } else {
        navigate('/complete-register')
      }
    }
  }, [
    authInformations,
    authInformations.token?.accessToken,
    authInformations.user?.registerCompleted,
    authInformations.user?.userType,
    navigate,
  ])

  async function handleGoogleLoginButtonClick() {
    try {
      const { authorizationUrl } = await AuthAPI.fetchGoogleRedirectUri()
      window.location.href = authorizationUrl
    } catch (error) {
      console.error(error)
      toast.error('Erro ao buscar a URL de Autenticação')
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen flex-col gap-8">
        <img
          src={loginBackgroundTop}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="
              pointer-events-none select-none absolute top-0 right-0 -z-10 lg:hidden
              [@media(orientation:landscape)]:hidden [@media(max-height:480px)]:hidden
            "
        />

        <Title align="center">Bem-vindo(a) ao BS Beauty Academy!</Title>

        <div className="w-full max-w-sm">
          <LoginWithEmailAndPasswordForm />
        </div>

        <div className="flex w-full max-w-sm flex-col items-center justify-center [@media(min-height:650px)]:gap-5">
          <p className="text-[#DBDBDB]">Outras formas de login:</p>
          <button
            onClick={handleGoogleLoginButtonClick}
            className="relative z-10 flex w-full items-center justify-center gap-2.5 rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm bg-[#DBDBDB] p-2 text-sm font-medium text-[#1E1E1E]"
          >
            <img src={googleIcon} alt="Ícone do Google" />
            Continuar com o Google
          </button>
        </div>

        <img
          src={loginBackgroundBottom}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="
            pointer-events-none select-none absolute left-0 bottom-0 w-full h-auto object-contain -z-10 lg:hidden
            [@media(orientation:landscape)]:hidden [@media(max-height:480px)]:hidden
          "
        />
      </div>
    </>
  )
}

export default Login
