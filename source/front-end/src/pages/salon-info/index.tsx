import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import { salonInfoAPI } from '../../store/salon-info/salon-info-api'
import SalonInfoDisplay from './components/salon-info/SalonInfoDisplay'
import UpdateSalonInfoForm from './components/salon-info/UpdateSalonInfoForm'

function SalonInfo() {
  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user.userType === UserType.MANAGER

  const salonInfo = salonInfoAPI.useFetchSalonInfoQuery(1)
  const salonInfoData = salonInfo.data

  if (salonInfo.isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando informações...
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Title align={'left'}>Informações do Salão</Title>
        <p className="text-primary-200 text-sm">
          {isManager
            ? 'Atualize aqui as informações do seu salão para que clientes possam encontrá-lo e conhecer seus serviços.'
            : 'Confira as informações do salão, incluindo endereço, telefone e horários de funcionamento. Tudo o que você precisa saber para planejar sua visita.'}
        </p>
      </div>
      {isManager ? (
        <UpdateSalonInfoForm salonInfoData={salonInfoData} />
      ) : (
        <SalonInfoDisplay salonData={salonInfoData} />
      )}
    </div>
  )
}

export default SalonInfo
