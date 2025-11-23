/* eslint-disable react-hooks/rules-of-hooks */
import { useFormContext } from 'react-hook-form'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { CreateAppointmentFormData } from '../types'
import SelectableServiceList from './components/selectable-service-list'
import { useNormalizedServices } from './hooks/useNormalizedServices'
import ServiceFilterForm from './components/customer-home-select-service-filter-form'
import { Pagination } from '../../../../../../components/select/Pagination'

export type SchedullingFlows = 'service' | 'professional'

interface Props {
  currentFlow: SchedullingFlows
  goNextStep?: () => void
  goPreviousStep?: () => void
}

function CustomerHomeSelectServiceContainer({ currentFlow, goNextStep, goPreviousStep }: Props) {
  const { watch } = useFormContext<CreateAppointmentFormData>()
  const professionalId = watch('professionalId')

  const {
    filters,
    setFilters,
    categories,
    services,
    error,
    isError,
    isLoading,
    currentPage,
    totalPages,
    totalItems,
    pageLimit,
  } = useNormalizedServices({
    currentFlow,
    professionalId,
  })

  if (isLoading) return <BSBeautyLoading title="Carregando os serviços..." />
  if (isError) {
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
        onFiltersChange={(next) => setFilters((curr) => ({ ...curr, ...next, page: 1 }))}
        categories={categories}
      />

      <SelectableServiceList
        currentFlow={currentFlow}
        services={services}
        onArrowClick={goNextStep}
        onBackClick={goPreviousStep}
      />

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            pageLimit={pageLimit}
            onPageChange={(page) => setFilters((curr) => ({ ...curr, page }))}
          />
        </div>
      )}
    </>
  )
}

export default CustomerHomeSelectServiceContainer
