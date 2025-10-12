import logo from '../../assets/logo.svg'
import insidePhoto from '../../assets/inside-photo.png'
import arrowDown from '../../assets/keyboard_arrow_down.svg'
import stars from '../../assets/five-stars.svg'
import location from '../../assets/location_on.svg'
import calendar from '../../assets/Calendar.svg'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import { Button } from '../../components/button/Button'
import { publicAnalyticsApi } from '../../store/analytics/public-analytics-api'
import RatingCardsContainer from './components/RatingCardsContainer'
import SalonRatingCard from './components/SalonRatingCard'

const services = [
  'Remoção a Laser de Micro e Tatto',
  'Nanopigmentação',
  'Brow Lamination',
  'Reconstrução de Sobrancelhas',
  'Depilação a Cera',
  'Depilação a Laser',
  'Alongamento de Unhas',
  'Banho de Gel',
  'Manicure',
  'Estética Facial e Corporal',
  'Emagrecimento',
  'Terapia Capilar',
  'Botox',
]

function LandingPage() {
  const navigate = useNavigate()
  const authInformations = useAppSelector((state) => state.auth)
  const { data } = publicAnalyticsApi.useFetchRatingsAnalyticsQuery()
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)

  useEffect(() => {
    if (authInformations.token?.accessToken) {
      if (authInformations.user?.registerCompleted) {
        console.log(authInformations)
        navigate(
          `/${authInformations.user.userType.toString().toLowerCase()}/home`,
        )
      } else {
        navigate('/')
      }
    }
  }, [
    authInformations,
    authInformations.token?.accessToken,
    authInformations.user?.registerCompleted,
    authInformations.user?.userType,
    navigate,
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-start px-4">
      {/* Logo */}
      <img src={logo} alt="Logo" className="my-[72px] mx-auto" />

      {/* Texto + Lista de Serviços */}
      <div className="space-y-[16px] mb-8 w-full">
        <p className="text-center text-[#D9D9D9] text-[16px] leading-normal">
          Entregamos a experiência que você merece e somos
          <span className="text-[#A4978A] font-semibold "> especialistas </span>
          em:
        </p>
        <div className="h-[40px] flex flex-col items-center justify-center text-[#A4978A]">
          <p
            key={currentServiceIndex}
            className="text-[16px] font-normal font-[Fredoka] animate-fadeIn"
          >
            {services[currentServiceIndex]}
          </p>
        </div>
      </div>
      <div className="w-full">
        <SalonRatingCard
          image={logo}
          name="BS Beauty"
          meanRating={
            data?.salonRating.meanScore
              ? Number(data?.salonRating.meanScore)
              : 0
          }
          ratingCount={data?.salonRating.ratingCount || 0}
        />
        <RatingCardsContainer professionals={data?.professionals || []} />
      </div>
      {/* Frase + Estrelas + Botão + Seta */}
      <div className="flex flex-col items-center gap-6 my-[42px]">
        <p className="text-center text-[#D9D9D9] font-kumbh text-[15.92px] leading-normal">
          Venha nos conhecer e se permitir viver essa experiência com você
          mesma!
        </p>

        <img className="pb-2" src={stars} alt="Cinco Estrelas" />

        <Button
          onClick={() => navigate('/login')}
          className="w-5/6 justify-center items-center"
          label="Entrar"
          type="submit"
          variant="outline"
        />

        <img
          src={arrowDown}
          alt="Seta Para Baixo"
          className="cursor-pointer"
          onClick={() => window.scrollBy({ top: 760, behavior: 'smooth' })}
        />
      </div>

      {/* Divisória */}
      <div className="w-full h-1 bg-[#595149] shrink-0" />

      {/* Foto + Endereço */}
      <div className="w-full my-[34px]">
        <img
          src={insidePhoto}
          alt="Salão"
          className="mb-8 w-full rounded-3xl object-cover"
        />

        <div className="mb-4 flex items-center">
          <img src={location} alt="Localização" className="mr-2 size-6" />
          <p className="text-lg font-kumbh text-[#D9D9D9]">Nosso endereço:</p>
        </div>

        <p className="font-kumbh font-semibold text-[#D9D9D9] justify-center">
          Rua Luís Pitta, 206 – Cidade São Mateus, São Paulo – SP
        </p>

        {/* Divisória */}
        <div className="my-[24px] h-1 w-full bg-[#595149] shrink-0" />

        {/* Horários */}
        <div className=" flex items-center">
          <img src={calendar} alt="Calendário" className="mr-2 h-6 w-6" />
          <p className="text-lg font-kumbh text-[#D9D9D9]">
            Horários de Funcionamento:
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md py-6 text-[16px] font-kumbh font-semibold text-[#D9D9D9]">
            {[
              { day: 'Segunda-Feira', time: '08:00 - 19:00' },
              { day: 'Terça-Feira', time: '08:00 - 19:00' },
              { day: 'Quarta-Feira', time: '08:00 - 19:00' },
              { day: 'Quinta-Feira', time: '08:00 - 19:00' },
              { day: 'Sexta-Feira', time: '08:00 - 19:00' },
              { day: 'Sábado', time: '08:00 - 18:00' },
              { day: 'Domingo', time: 'Fechado' },
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
        onClick={() => navigate('/login')}
        className="my-8 w-4/6 justify-center items-center"
        label="Entrar"
        type="submit"
        variant="outline"
      />
    </div>
  )
}

export default LandingPage
