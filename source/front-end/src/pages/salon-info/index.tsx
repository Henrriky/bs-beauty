import { useUserCanAccess } from '../../hooks/authorization/use-user-can-access'
import { PageHeader } from '../../layouts/PageHeader'
import { UserType } from '../../store/auth/types'
import { salonInfoAPI } from '../../store/salon-info/salon-info-api'
import SalonInfoDisplay from './components/salon-info/SalonInfoDisplay'
import UpdateSalonInfoForm from './components/salon-info/UpdateSalonInfoForm'

function SalonInfo() {
  const salonInfo = salonInfoAPI.useFetchSalonInfoQuery(1)
  const salonInfoData = salonInfo.data

  const canUserAccessUpdateSalonInfo = useUserCanAccess({
    allowedPermissions: ['salon_info.update'],
    allowedUserTypes: [UserType.MANAGER],
    strategy: 'ANY',
  })

  if (salonInfo.isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando informações...
      </p>
    )
  }

  const pageSubtitle = canUserAccessUpdateSalonInfo
    ? 'Atualize aqui as informações do seu salão para que clientes possam encontrá-lo e conhecer seus serviços.'
    : 'Confira as informações do salão, incluindo endereço, telefone e horários de funcionamento. Tudo o que você precisa saber para planejar sua visita.'

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Informações do Salão" subtitle={pageSubtitle} />
      {canUserAccessUpdateSalonInfo ? (
        <UpdateSalonInfoForm salonInfoData={salonInfoData} />
      ) : (
        <SalonInfoDisplay salonData={salonInfoData} />
      )}
    </div>
  )
}

export default SalonInfo
