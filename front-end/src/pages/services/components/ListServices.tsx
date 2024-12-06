import { useState } from 'react'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import '../../../../src/index.css'

function ListServices() {
  const [selected, setSelected] = useState(null)

  const { data, isLoading, isError } = serviceAPI.useGetServicesQuery()

  if (isLoading) {
    return <p className="text-gray-500">Carregando serviços...</p>
  }

  if (isError) {
    return <p className="text-red-500">Erro ao carregar os serviços.</p>
  }

  return (
    <div className="relative top-[90px] left-[3px] animate-fadeIn w-full mb-8 h-[140px] scroll overflow-y-auto">
      <div className="flex flex-col justify-center items-center gap-2 p-[20px]">
        {data?.services.map((service, index) => (
          <Button
            label={service.name}
            key={index}
            variant="outline"
            outlineVariantBorderStyle="dashed"
            onClick={() => setSelected(index)}
            buttonClassName={`bg-[#222222] shadow-[-1px_5px_26.5px_rgba(0,0,0,0.25)] w-full max-w-[370px] text-left px-4 py-[6px] ${selected !== index ? 'border-none' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ListServices
