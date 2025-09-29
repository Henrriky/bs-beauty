import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import { toast } from 'react-toastify'
import { Service } from '../../../store/service/types'
import ServiceItem from './ServiceItem'
import { OnSubmitUpdateServiceStatusForm } from './types'
import { useMemo } from 'react'
import useAppSelector from '../../../hooks/use-app-selector'

interface ListServicesProps {
  openModal: () => void
  openUpdateModal: () => void
  openDeleteModal: () => void
  serviceSelected: Service | undefined | null
  selectService: (param: Service | null) => void
  isManager: boolean
}

function ListServices({
  openModal,
  openDeleteModal,
  openUpdateModal,
  serviceSelected,
  selectService,
  isManager,
}: ListServicesProps) {
  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)

  const loggedUserId = useAppSelector((state) => state.auth.user?.id)
  const { data, isLoading, isError } = serviceAPI.useGetServicesQuery({
    page: 1,
    limit: 50,
  })

  const [updateService, { isLoading: isUpdatingServiceStatus }] =
    serviceAPI.useUpdateServiceMutation()

  const handleChangeServiceStatus = (
    serviceId: string,
  ): OnSubmitUpdateServiceStatusForm => {
    return async ({ status }) => {
      try {
        await updateService({ data: { status }, id: serviceId }).unwrap()
        toast.success('Serviço atualizado com sucesso!')
      } catch (error: unknown) {
        console.error('Error trying to update offer', error)
        toast.error('Ocorreu um erro ao atualizar o serviço.')
      }
    }
  }

  const services = useMemo(() => {
    if (!data) return []

    const filteredService = isManager
      ? data.data
      : data.data.filter(
          (service) =>
            service.status === 'APPROVED' || service.createdBy === loggedUserId,
        )

    return [...filteredService].sort((a, b) => {
      const statusOrder = { APPROVED: 1, PENDING: 2, REJECTED: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  }, [data, isManager, loggedUserId])

  if (isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando serviços...
      </p>
    )
  }

  if (isError && !data == null) {
    return (
      <p className="text-[#CC3636] animate-fadeIn w-full mt-2 text-sm">
        Não há serviços disponíveis.
      </p>
    )
  }

  if (isError) {
    console.log(data)
    return (
      <p className="text-[#CC3636] animate-fadeIn w-full mt-2 text-sm">
        Erro ao carregar os serviços.
      </p>
    )
  }

  return (
    <div className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4">
      <div className="max-h-[500px] scroll overflow-y-auto w-full">
        <div className="gap-2 p-[2px] w-full flex flex-col justify-center items-center">
          {services.map((service, index) => (
            <ServiceItem
              service={service}
              isManager={isManager}
              openUpdateModal={() => {
                selectService(service)
                openUpdateModal()
              }}
              openDeleteModal={() => {
                selectService(service)
                openDeleteModal()
              }}
              onStatusChange={handleChangeServiceStatus(service.id)}
              key={index}
              onClick={(e) => {
                selectService(service)
                e.stopPropagation()
              }}
              isSelected={serviceSelected?.id === service.id}
              isChangingStatus={isUpdatingServiceStatus}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 w-full flex flex-col justify-center items-center">
        <Button
          label="Oferecer serviço"
          className="w-full max-h-[32px] py-[6px]"
          onClick={
            serviceSelected
              ? () => {
                  if (serviceSelected.status !== 'APPROVED') {
                    toast.info(
                      'Atenção: Apenas serviços aprovados podem ser oferecidos.',
                    )
                    return
                  }

                  openModal()
                }
              : () => toast.info('Selecione um serviço.')
          }
        />
      </div>
    </div>
  )
}

export default ListServices
