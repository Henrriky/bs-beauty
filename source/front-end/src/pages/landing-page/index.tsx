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
import ProfilePicture from '../profile/components/ProfilePicture'
import { publicAnalyticsApi } from '../../store/analytics/public-analytics-api'


function LandingPage() {
  const navigate = useNavigate()
  const authInformations = useAppSelector((state) => state.auth)
  const analytics = publicAnalyticsApi.useFetchRatingsAnalyticsQuery();

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

    
  <div className="flex flex-col items-center justify-start overflow-auto">
    {/* Logo */}
    <img src={logo} alt="Logo" className="my-[72px] mx-auto" />

    {/* Texto + Lista de Serviços */}
    <div className="space-y-[16px]">
      <p className="w-[377px] text-center text-[#D9D9D9] font-kumbh text-[16px] font-bold leading-normal">
        Reconhecidas por entregar a experiência que você merece! Especialistas em:
      </p>
      <div className="flex justify-center">
        <div className='flex items-center flex-col'>
          <ProfilePicture profilePhotoUrl={''} />
          <span>Nome</span>
          <span>Especialidade</span>
        </div>
        <div className='flex items-center gap-1'>
          <span>Star</span>
          <span>N avaliações</span>
        </div>
      </div>
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

    {/* Frase + Estrelas + Botão + Seta */}
    <div className="flex flex-col items-center space-y-[24px] my-[42px]">
      <p className="w-[377px] text-center text-[#D9D9D9] font-kumbh text-[15.92px] leading-normal">
        Venha nos conhecer e se permitir viver essa experiência com você mesma!
      </p>

      <img src={stars} alt="Cinco Estrelas" />

      <Button
        onClick={() => navigate("/login")}
        className="w-[280px] justify-center items-center"
        label="Entrar"
        type="submit"
        variant="outline"
      />

      <img
        src={arrowDown}
        alt="Seta Para Baixo"
        className="cursor-pointer"
        onClick={() =>
          window.scrollBy({ top: 760, behavior: "smooth" })
        }
      />
    </div>

    {/* Divisória */}
    <div className="w-full h-[6px] bg-[#595149] shadow-[0px_6px_4px_6px_rgba(0,0,0,0.20)] shrink-0" />

    {/* Foto + Endereço */}
    <div className="max-w-5xl mx-auto my-[34px]">
      <img
        src={insidePhoto}
        alt="Salão"
        className="mb-8 w-full rounded-3xl object-cover"
      />

      <div className="mb-2 flex items-center">
        <img src={location} alt="Localização" className="mr-2 h-8 w-8" />
        <p className="text-2xl font-kumbh text-[#D9D9D9]">Nosso endereço:</p>
      </div>

      <p className="pl-4 text-base font-kumbh font-semibold text-[#D9D9D9]">
        Rua Luís Pitta, 206 – Cidade São Mateus, São Paulo – SP
      </p>

      {/* Divisória */}
      <div className="my-[24px] h-[3px] w-full bg-[#595149] shrink-0" />

      {/* Horários */}
      <div className="my-8 mb-2 flex items-center">
        <img src={calendar} alt="Calendário" className="mr-2 h-6 w-8" />
        <p className="text-2xl font-kumbh text-[#D9D9D9]">
          Horários de Funcionamento:
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md p-6 text-[16px] font-kumbh font-semibold text-[#D9D9D9]">
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
              <span className="flex-grow border-b border-dotted border-white/70" />
              <span>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Login final */}
    <div className="w-4/5 text-center font-['Fredoka'] font-normal text-[#A4978A]">
      Faça seu login e venha aproveitar os nossos serviços!
    </div>

    <Button
      onClick={() => navigate("/login")}
      className="my-8 w-[280px] justify-center items-center"
      label="Entrar"
      type="submit"
      variant="outline"
    />
  </div>
)

}

export default LandingPage
