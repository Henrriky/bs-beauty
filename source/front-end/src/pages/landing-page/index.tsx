import logo from'../../assets/logo.svg'
import insidePhoto from '../../assets/inside-photo.png'
import arrowDown from '../../assets/keyboard_arrow_down.svg'
import stars from '../../assets/five-stars.svg'
import location from '../../assets/location_on.svg'
import calendar from '../../assets/calendar.svg'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import { Button } from '../../components/button/Button'


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
  

  return (
    <>
      <div className="flex justify-start items-center overflow-auto flex-col">
        
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

        
          <Button 
            onClick={() => navigate("/login")}
            className="justify-center items-center w-[260px]" label="Entrar" type="submit" variant="outline">
          </Button>

        <img
          src={arrowDown}
          alt="Seta Para Baixo"
          className="cursor-pointer"
          onClick={() => {
            window.scrollBy({ top: 760, behavior: "smooth" });
          }}
        />
        </div>

        <div className="w-[100%] h-[6px] bg-[#595149] shadow-[0px_6px_4px_6px_rgba(0,0,0,0.20)] shrink-0"></div>
        
        <div className='my-[34px] '> </div>
        
       
        <div className="max-w-5xl mx-auto">
          <img
            src={insidePhoto}
            alt="Salão"
            className="rounded-3xl w-full object-cover mb-8"
          />

          <div className="flex items-center mb-2">
            <img src={location} alt="Localização" className="w-8 h-8 mr-2 font-semibold"/>
            <p className="text-[#D9D9D9] text-2xl font-kumbh ">
              Nosso endereço:
            </p>
          </div>

          <p className="text-[#D9D9D9] text-base font-kumbh font-semibold pl-4">
            Rua Luís Pitta, 206 – Cidade São Mateus, São Paulo – SP
          </p>
        

          <div className='my-[24px] '> </div>
          <div className="w-[100%] h-[3px] bg-[#595149] shrink-0"></div>
          <div className='my-[24px] '> </div>


          
          <div className="flex items-center mb-2 my-8">
            <img src={calendar} alt="Calendário" className="w-8 h-6 mr-2 font-semibold"/>
            <p className="text-[#D9D9D9] text-2xl font-kumbh ">
              Horários de Funcionamento:
            </p>
          </div>
          
          <div className='flex justify-center'>
          <div className="w-[100%] text-[16px] text-[#D9D9D9] p-6 max-w-md font-semibold font-kumbh">
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
        </div>
        </div>

        
        
        

        <div className="w-[80%] text-center font-normal text-[#A4978A] font-['Fredoka']">Faça seu login e venha aproveitar os nossos serviços!</div>


        <Button 
          onClick={() => navigate("/login")}
          className="justify-center items-center w-[260px] my-8" label="Entrar" type="submit" variant="outline">
        </Button>

        
      </div>
    </>
  )
}

export default LandingPage
