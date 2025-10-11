import { Button } from '../../../components/button/Button'
import { toast } from 'react-toastify'
import { Service } from '../../../store/service/types'
import ServiceItem from './ServiceItem'
import BSBeautyLoading from '../../../components/feedback/Loading'
import { useServicesLogic } from '../hooks/useServicesLogic'

interface ListServicesProps {
  openModal: () => void
  openUpdateModal: () => void
  openDeleteModal: () => void
  serviceSelected: Service | undefined | null
  selectService: (param: Service | null) => void
}

function ListServices({
  openModal,
  openDeleteModal,
  openUpdateModal,
  serviceSelected,
  selectService,
}: ListServicesProps) {
  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)
  const {
    services,
    loggedUserId,
    isLoadingServices,
    isErrorLoadingServices,
    isUpdatingServiceStatus,
    handleChangeServiceStatus,
  } = useServicesLogic()

  if (isLoadingServices) return <ListServicesLoading />
  if (isErrorLoadingServices) return <ListServicesError />
  if (services.length === 0) return <ListServicesEmpty />

  return (
    <div className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4">
      <div className="max-h-[500px] scroll overflow-y-auto w-full">
        <div className="gap-2 p-[2px] w-full flex flex-col justify-center items-center">
          {services.map((service, index) => (
            <ServiceItem
              loggedUserId={loggedUserId}
              service={service}
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

function ListServicesLoading() {
  return (
    <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm text-center my-4">
      <BSBeautyLoading title="Carregando serviços..." />
    </p>
  )
}

function ListServicesError() {
  return (
    <p className="text-[#CC3636] animate-fadeIn w-full mt-2 text-sm">
      Erro ao carregar os serviços.
    </p>
  )
}

function ListServicesEmpty() {
  return (
    <div className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4">
      <p className="text-primary-100 text-lg mb-2 text-center">
        Nenhum serviço encontrado
      </p>
      <p className="text-primary-200 text-sm text-center">
        Tente ajustar os filtros ou criar um novo serviço
      </p>
    </div>
  )
}

export default ListServices
