import logo from '../../assets/logo.svg'
import video from '../../assets/landing-page-video.mp4'
import arrowDown from '../../assets/keyboard_arrow_down.svg'
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
    <div className="flex flex-col items-center justify-start px-4 sm:px-8 lg:px-16 pb-16">
      <img
        src={logo}
        alt="Logo"
        className="my-10 sm:my-20 lg:hidden mx-auto w-32 sm:w-48 transition-transform hover:scale-105 duration-300"
      />
      
      <div className="w-full max-w-6xl mb-10 lg:mb-16 mt-0 lg:mt-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 lg:space-y-6 space-y-4 lg:flex lg:flex-col lg:items-center lg:text-center">
            <img
              src={logo}
              alt="Logo"
              className="hidden lg:block mx-auto lg:mx-0 w-56 mb-8 transition-transform hover:scale-105 duration-300"
            />
            <p className="text-center lg:text-left text-[#D9D9D9] text-lg sm:text-xl lg:text-2xl leading-relaxed font-light lg:flex lg:flex-col lg:items-center">
              Entregamos a experiência que você 
              <span className="text-[#A4978A] font-semibold "> merece!</span>
            </p>
            <p className="text-center lg:text-left text-[#D9D9D9] text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
              Somos
              <span className="text-[#A4978A] font-semibold"> especialistas </span>
              em:
            </p>
            <div className="h-14 flex flex-col items-center lg:items-start justify-center text-center">
              <p
                key={currentServiceIndex}
                className="text-xl sm:text-2xl lg:text-3xl font-medium font-[Fredoka] text-[#A4978A] animate-fadeIn text-center lg:text-center"
              >
                {services[currentServiceIndex]}
              </p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center">
            <video
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full max-w-sm lg:max-w-md rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8  text-center">
        <p className="text-[#D9D9D9] font-kumbh text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl px-4">
          Reserve um tempo para você. Venha descobrir a sua 
          <span className="text-[#A4978A] font-semibold"> melhor versão!</span>
        </p>
        <Button
          onClick={() => navigate('/login')}
          className="max-w-sm w-full justify-center items-center text-lg py-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          label="Entrar"
          type="submit"
          variant="outline"
        />

        <img
          src={arrowDown}
          alt="Seta Para Baixo"
          className="cursor-pointer w-10 sm:w-12 opacity-70 hover:opacity-100 transition-all duration-300 animate-bounce mt-4"
          onClick={() => window.scrollBy({ top: 740, behavior: 'smooth' })}
        />
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#A4978A] to-transparent my-8" />

      <div className="w-full max-w-4xl mt-8">
        <div className="mb-10 w-full">
          <p className="text-center text-[#D9D9D9] text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
            Veja o que nossas clientes 
            <span className="text-[#A4978A] font-semibold"> nossas clientes </span>
            acham de nós!
          </p>
        </div>
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto mb-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
        </div>
        <div className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto text-center mb-4'>
          {data?.professionals?.length === 1 ? (
            <div className="w-full shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <SalonRatingCard
                image={data.professionals[0].profilePhotoUrl || logo}
                name={data.professionals[0].name || 'Profissional'}
                meanRating={
                  data.professionals[0].meanRating
                    ? Number(data.professionals[0].meanRating)
                    : 0
                }
                ratingCount={data.professionals[0].ratingCount || 0}
              />
            </div>
          ) : (
            <RatingCardsContainer professionals={data?.professionals || []} />
          )}
        </div>
        <img
          src={arrowDown}
          alt="Seta Para Baixo"
          className="cursor-pointer w-10 sm:w-12 opacity-70 hover:opacity-100 transition-all duration-300 animate-bounce m-auto mt-8"
          onClick={() => window.scrollBy({ top: 660, behavior: 'smooth' })}
        />
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#A4978A] to-transparent my-8" />

      <div className="w-full max-w-5xl mt-8">
        <div className="mb-10 w-full">
          <p className="text-center text-[#D9D9D9] text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
            Faça uma
            <span className="text-[#A4978A] font-semibold"> visita! </span>
          </p>
        </div>
        <div className="bg-[#222222] rounded-2xl p-8 sm:p-10 mb-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#A4978A]/20 p-3 rounded-full">
              <img src={location} alt="Localização" className="size-7 brightness-150" />
            </div>
            <p className="text-2xl sm:text-3xl font-kumbh font-semibold text-[#A4978A]">Nosso endereço</p>
          </div>

          <p className="font-kumbh text-lg sm:text-xl text-[#D9D9D9] leading-relaxed ml-16">
            Rua Luís Pitta, 206 – Cidade São Mateus, São Paulo – SP
          </p>
        </div>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-[#595149] to-transparent" />

        <div className="bg-[#222222] rounded-2xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-start gap-3 sm:gap-4 mb-8">
            <div className="bg-[#A4978A]/20 p-3 rounded-full shrink-0">
              <img src={calendar} alt="Calendário" className="size-7 brightness-150" />
            </div>
            <p className="text-lg sm:text-2xl md:text-3xl font-kumbh font-semibold text-[#A4978A] leading-tight">
              Horários de Funcionamento
            </p>
          </div>

          <div className="flex justify-start">
            <div className="w-full  text-base sm:text-lg font-kumbh font-medium text-[#D9D9D9] space-y-4">
              {[
                { day: 'Segunda-Feira', time: '08:00 - 19:00' },
                { day: 'Terça-Feira', time: '08:00 - 19:00' },
                { day: 'Quarta-Feira', time: '08:00 - 19:00' },
                { day: 'Quinta-Feira', time: '08:00 - 19:00' },
                { day: 'Sexta-Feira', time: '08:00 - 19:00' },
                { day: 'Sábado', time: '08:00 - 18:00' },
                { day: 'Domingo', time: 'Fechado' },
              ].map(({ day, time }) => (
                <div key={day} className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-[#2A2A2A] transition-all duration-200 rounded-xl p-3 group">
                  <span className="sm:min-w-[150px] md:min-w-[180px] group-hover:text-[#A4978A] transition-colors">{day}</span>
                  <span className="hidden sm:block flex-grow border-b border-dotted border-[#595149] group-hover:border-[#A4978A] transition-colors" />
                  <span className="text-[#A4978A] font-semibold text-lg">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl text-center mt-16 mb-8">
        <div className="mb-10 w-full">
          <p className="text-center text-[#D9D9D9] text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
            Faça seu
            <span className="text-[#A4978A] font-semibold"> login </span>
            e venha aproveitar os nossos serviços!
          </p>
        </div>

        <Button
          onClick={() => navigate('/login')}
          className="max-w-sm w-full justify-center items-center text-lg py-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          label="Entrar"
          type="submit"
          variant="outline"
        />
      </div>
    </div>
  )
}

export default LandingPage
