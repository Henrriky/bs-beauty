import { useState } from 'react'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'

function ListServices() {
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
      <p className="text-[#CC3636] animate-fadeIn w-full mb-8 text-sm">
        Erro ao carregar os serviços.
      </p>
    )
  }

  return (
    <div className="animate-fadeIn w-full mb-8 scroll overflow-y-auto mt-4">
      <div className="flex flex-col justify-center gap-2 p-[2px]">
        {data?.services.map((service, index) => (
          <Button
            label={service.name}
            key={index}
            variant="outline"
            outlineVariantBorderStyle="dashed"
            onClick={() => setSelected(index)}
            className={`bg-[#222222] w-full max-w-[370px] text-left px-4 py-[6px] ${selected !== index ? 'border-none' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ListServices
