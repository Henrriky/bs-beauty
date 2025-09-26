import googleIcon from '../../assets/google.svg'
import logo from'../../assets/logo.svg'
import insidePhoto from '../../assets/inside-photo.png'
import arrowDown from '../../assets/keyboard_arrow_down.svg'
import stars from '../../assets/five-stars.svg'
import location from '../../assets/location_on.svg'
import calendar from '../../assets/calendar.svg'
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
      <div className="flex justify-start items-center h-[1711px] overflow-auto flex-col">
        
        <img
          src={logo}
          alt="Logo"
          className="my-[72px] mx-auto"
        />

        <div className='space-y-[16px]'>
        <p className="w-[377px] text-[#D9D9D9] text-center font-kumbh text-[16px] font-bold leading-normal">
            Reconhecidas por entregar a experiência que você merece! Especialistas em:
        </p>

        <ul className="list-disc pl-6 text-[#A4978A] text-[16px] font-normal font-[Fredoka]">
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
        </div>

        <div className='flex flex-col items-center space-y-[24px] my-[42px]'>

        <p className="w-[377px] text-[#D9D9D9] text-center font-kumbh text-[15.92px] leading-normal">
            Venha nos conhecer e se permitir viver essa experiência com você mesma!
        </p>

        <img
          src={stars}
          alt="Cinco Estrelas"
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
          src={arrowDown}
          alt="Seta Para Baixo"
        />
        </div>

        <div className="w-[120%] h-[3px] bg-[#595149] shadow-[0px_6px_4px_6px_rgba(0,0,0,0.25)] shrink-0"></div>
        <div className='my-[42px] '>
        <img
          src={insidePhoto}
          alt="Salão"
          className='rounded-3xl mx-auto'
        />
        
        <div className='flex justify-start'>
            <img
            src={location}
            alt="Localização"
            />
            <h2 className="text-[#D9D9D9] text-[24px] font-kumbh font-bold">
                Nosso endereço:
            </h2>
        </div>
        
        <p className="text-[#D9D9D9] text-[16px] font-kumbh font-semibold">
            Rua Luís Pitta, 206 – Cidade São Mateus, São Paulo – SP
        </p>
       
        </div>
        <div className="w-[120%] h-[1px] bg-[#595149] shrink-0"></div>

        
        <div className='flex justify-start'>
            <img
                src={calendar}
                alt="Calendário"
            />
            <h2 className="text-[#D9D9D9] text-[24px] font-kumbh font-bold">
                Horários de Funcionamento:
            </h2>
        </div>
        <div className="w-[80%] text-[16px] text-[#D9D9D9] p-6 max-w-md font-semibold font-kumbh">
            {[
                { day: "Segunda-Feira", time: "08:00 - 19:00" },
                { day: "Terça-Feira", time: "08:00 - 19:00" },
                { day: "Quarta-Feira", time: "08:00 - 19:00" },
                { day: "Quinta-Feira", time: "08:00 - 19:00" },
                { day: "Sexta-Feira", time: "08:00 - 19:00" },
                { day: "Sábado", time: "08:00 - 18:00" },
                { day: "Domingo", time: "Fechado" },
            ].map(({ day, time }) => (
                <div key={day} className="flex items-center gap-2">
                <span>{day}</span>
                <span className="flex-grow border-b border-dotted border-white/70"></span>
                <span>{time}</span>
                </div>
            ))}
        </div>

        <div className="w-[80%] text-center font-normal text-[#A4978A] font-['Fredoka']">Faça seu login e venha aproveitar os nossos serviços!</div>

        <div>
          <button
            onClick={handleButtonClick}
            className="flex justify-center items-center gap-2.5 bg-[#DBDBDB] p-2 rounded w-[320px] text-[#1E1E1E] text-sm font-medium rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm z-10 relative"
          >
            <img src={googleIcon} alt="Ícone do Google" />
            Logar com o Google
          </button>
        </div>
        
      </div>
    </>
  )
}

export default LandingPage
