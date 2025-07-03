import googleIcon from '../../assets/google.svg'
import logo from'../../assets/logo.svg'
import insidePhoto from '../../assets/inside-photo.png'
import * as AuthAPI from '../../api/auth-api'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'

function LandingPage() {
  const navigate = useNavigate()
  const authInformations = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (authInformations.token?.accessToken) {
      if (authInformations.user?.registerCompleted) {
        navigate(`/${authInformations.user.role.toString().toLowerCase()}/home`)
      } else {
        navigate('/')
      }
    }
  }, [
    authInformations.token?.accessToken,
    authInformations.user?.registerCompleted,
    authInformations.user?.role,
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
      <div className="flex justify-start items-center h-[1711px] overflow-auto flex-col">
        
        <img
          src={logo}
          alt="Logo"
          className="mt-[73px] mx-auto"
        />

        <ul className="list-disc pl-6 text-[#A4978A] text-[15.92px] font-normal font-[Fredoka] space-y-1">
            <li>Remoção a Laser de Micro e Tatto</li>
            <li>Nanopigmentação</li>
            <li>Brow Lamination</li>
            <li>Reconstrução de Sobrancelhas</li>
            <li>Depilação a Cera</li>
            <li>Depilação a Laser</li>
            <li>Alongamento de Unhas</li>
            <li>Banho de Gel</li>
            <li>Manicure</li>
            <li>Estética Facial e Corporal</li>
            <li>Emagrecimento</li>
            <li>Terapia Capilar</li>
            <li>Botox</li>
        </ul>

        <div>
          <button
            onClick={handleButtonClick}
            className="flex justify-center items-center gap-2.5 bg-[#DBDBDB] p-2 rounded w-[320px] text-[#1E1E1E] text-sm font-medium rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm z-10 relative mt-[40%]"
          >
            <img src={googleIcon} alt="Ícone do Google" />
            Logar com o Google
          </button>
        </div>

        <img
          src={insidePhoto}
          alt="Salão"
          className="flex justify-center"
        />
      </div>
    </>
  )
}

export default LandingPage
