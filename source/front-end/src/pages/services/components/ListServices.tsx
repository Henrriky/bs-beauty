import { SetStateAction, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import { toast } from 'react-toastify'
import { Service } from '../../../store/service/types'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ListServicesProps {
  openModal: () => void
  selectService: (param: Service) => void
  isManager: boolean
  openUpdateModal: () => void
  openDeleteModal: () => void
}

function ListServices({
  openModal,
  selectService,
  isManager,
  openDeleteModal,
  openUpdateModal,
}: ListServicesProps) {
  const [selected, setSelected] = useState(null)

  // TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
  // TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)
  const { data, isLoading, isError } = serviceAPI.useGetServicesQuery({})

  const services = data?.data || []

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
    <div
      onClick={() => setSelected(null)}
      className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4"
    >
      <div className="max-h-[161px] scroll overflow-y-auto w-full">
        <div className="gap-2 p-[2px] w-full flex flex-col justify-center items-center">
          {services.map((service, index) => (
            <Button
              label={
                <div className="flex flex-row items-center">
                  {service.name}
                  {isManager && (
                    <div className="ml-auto flex gap-3 justify-center items-center">
                      <PencilSquareIcon
                        className="size-4 hover:text-primary-0 hover:size-5 transition-all"
                        onClick={() => openUpdateModal()}
                      />
                      <TrashIcon
                        className="size-4 hover:text-primary-0 hover:size-5 transition-all"
                        onClick={() => openDeleteModal()}
                      />
                    </div>
                  )}
                </div>
              }
              key={index}
              variant="outline"
              outlineVariantBorderStyle="dashed"
              onClick={(e) => {
                setSelected(index as unknown as SetStateAction<null>)
                selectService(service as unknown as Service)
                e.stopPropagation()
              }}
              className={`bg-[#222222] w-full text-left px-4 py-[6px] ${selected !== index ? 'border-none' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 w-full flex flex-col justify-center items-center">
        <Button
          label="Oferecer serviço"
          className="w-full max-h-[32px] py-[6px]"
          onClick={
            selected !== null
              ? () => {
                  openModal()
                  setSelected(null)
                }
              : () => toast.info('Selecione um serviço.')
          }
        />
      </div>
    </div>
  )
}

export default ListServices
