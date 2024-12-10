import { SetStateAction, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import { toast } from 'react-toastify'
import { Service } from '../../../store/service/types'

interface ListServicesProps {
  openModal: () => void
  selectService: (param: Service) => void
}

function ListServices({ openModal, selectService }: ListServicesProps) {
  const [selected, setSelected] = useState(null)

  const { data, isLoading, isError } = serviceAPI.useGetServicesQuery()

  if (isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando serviços...
      </p>
    )
  }

  if (isError) {
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
          {data?.services.map((service, index) => (
            <Button
              label={service.name}
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
