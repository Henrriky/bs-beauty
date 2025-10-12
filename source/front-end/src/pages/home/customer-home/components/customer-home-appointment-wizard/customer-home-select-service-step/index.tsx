/* eslint-disable react-hooks/rules-of-hooks */
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { CreateAppointmentFormData } from '../types'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import SelectableServiceList from './components/selectable-service-list'
import { useNormalizedServices } from './hooks/useNormalizedServices'
import ServiceFilterForm from './components/customer-home-select-service-filter-form'

export type SchedullingFlows = 'service' | 'professional'

interface Props {
  currentFlow: SchedullingFlows
}

// TODO: CARREGAR MAIS SERVIÇOS QUANDO CHEGA NO LIMITE PADRÃO (10)
// TODO: POSSÍVEL CRIAÇÃO DE INPUT DE BUSCA PARA BUSCAR PELO NOME (O PARÂMETRO JÁ ESTÁ FEITO NA API)
function CustomerHomeSelectServiceContainer({ currentFlow }: Props) {
  const { watch } = useFormContext<CreateAppointmentFormData>()
  const professionalId = watch('professionalId')
  const isMissingProfessionalSelection =
    !professionalId && currentFlow === 'professional'

  if (isMissingProfessionalSelection) {
    const message =
      'Por favor, selecione um funcionário para acessar a etapa de selecionar os serviços'

    toast.error(message)
    return <ErrorMessage message={message} />
  }

  const {
    filters,
    setFilters,
    categories,
    services,
    error,
    isError,
    isLoading,
  } = useNormalizedServices({
    currentFlow,
    professionalId,
  })

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
      <Subtitle align="left" className="text-[#A4978A] font-medium mb-6">
        Selecione o serviço que você deseja agendar:
      </Subtitle>
      <ServiceFilterForm
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />
      <SelectableServiceList currentFlow={currentFlow} services={services} />
    </>
  )
}

export default CustomerHomeSelectServiceContainer
