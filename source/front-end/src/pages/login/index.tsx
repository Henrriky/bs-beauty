import googleIcon from '../../assets/google.svg'
import loginBackgroundBottom from '../../assets/login-background-bottom.svg'
import loginBackgroundTop from '../../assets/login-background-top.svg'
import * as AuthAPI from '../../api/auth-api'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'

function Login() {
  const navigate = useNavigate()
  const authInformations = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (authInformations.token?.accessToken) {
      if (authInformations.user?.registerCompleted) {
        console.log(authInformations)
        navigate(
          `/${authInformations.user.userType.toString().toLowerCase()}/home`,
        )
      } else {
        navigate('/a')
      }
    }
  }, [
    authInformations,
    authInformations.token?.accessToken,
    authInformations.user?.registerCompleted,
    authInformations.user?.userType,
    navigate,
  ])

  async function handleButtonClick() {
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
      <div className="flex justify-center items-center h-screen flex-col">
        <img
          src={loginBackgroundTop}
          alt="Plano de fundo"
          className={`absolute top-0 right-0`}
          // className={`absolute right-[-${(LAYOUT_CONFIG.MAIN_HORIZONTAL_PADDING * 4).toString()}px] top-0`}
        />
        <div>
          <button
            onClick={handleButtonClick}
            className="flex justify-center items-center gap-2.5 bg-[#DBDBDB] p-2 rounded w-[320px] text-[#1E1E1E] text-sm font-medium rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm z-10 relative"
          >
            <img src={googleIcon} alt="Ícone do Google" />
            Logar com o Google
          </button>
        </div>

        <img
          src={loginBackgroundBottom}
          alt="Plano de fundo"
          className="absolute left-0 bottom-0 w-full h-auto object-contain"
        />
      </div>
    </>
  )
}

export default Login
