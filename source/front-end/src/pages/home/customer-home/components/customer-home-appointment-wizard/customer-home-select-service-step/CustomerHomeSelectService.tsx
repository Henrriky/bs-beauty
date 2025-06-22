import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { CreateAppointmentFormData } from '../types'
import CustomerHomeServiceCard from './CustomerHomeServiceCard'

function CustomerHomeSelectServiceContainer() {
  const { register, watch } = useFormContext<CreateAppointmentFormData>()
  const serviceSelectedId = watch('serviceId')

  const { data, isLoading, isError, error } = serviceAPI.useGetServicesQuery({})
  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)

  const services = data?.data || []

  if (isLoading) return <BSBeautyLoading title="Carregando os serviços..." />

  if (isError) {
    toast.error('Erro ao carregar os serviços')
    console.error(`Error trying to fetch services`, error)

    return (
      <div className="flex justify-center items-center h-full text-red-500">
        Erro ao carregar informações. Tente novamente mais tarde.
      </div>
    )
  }

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Selecione o serviço que você deseja agendar:
      </Subtitle>

      {services &&
        services.map((service) => {
          return (
            <div key={`service-label-${service.id}`}>
              <input
                className="invisible"
                type="radio"
                id={service.id}
                value={service.id}
                {...register('serviceId')}
              />
              <CustomerHomeServiceCard
                isSelected={serviceSelectedId === service.id}
                name={service.name}
                description={service.description}
                id={service.id}
                for={service.id}
              />
            </div>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectServiceContainer
