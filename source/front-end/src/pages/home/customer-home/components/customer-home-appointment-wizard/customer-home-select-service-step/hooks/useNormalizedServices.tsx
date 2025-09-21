/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react'
import { SchedullingFlows } from '..'
import { professionalAPI } from '../../../../../../../store/professional/professional-api'
import { serviceAPI } from '../../../../../../../store/service/service-api'
import { FindAllServicesParams } from '../../../../../../../store/service/types'

type UseNormalizedServiceOptions = {
  currentFlow: SchedullingFlows
  professionalId?: string
}

export function useNormalizedServices({
  currentFlow,
  professionalId,
}: UseNormalizedServiceOptions) {
  const [categoryCalculation, setCategoryCalculation] = useState<{
    categoryFlow: SchedullingFlows
    categories: string[]
  }>({ categories: [], categoryFlow: currentFlow })
  const [filters, setFilters] = useState<FindAllServicesParams>({
    q: '',
    category: '',
    limit: 10,
    page: 1,
  })

  const {
    data: getServicesResponse,
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: servicesError,
  } = serviceAPI.useGetServicesQuery(
    {
      ...(currentFlow !== 'service'
        ? { page: filters.page, limit: filters.limit }
        : { ...filters }),
    },
    {
      skip: currentFlow !== 'service',
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  )

  const {
    data: offersData,
    isLoading: isLoadingOffers,
    isError: isErrorOffers,
    error: offersError,
  } = professionalAPI.useFetchServicesOfferedByProfessionalQuery(
    {
      professionalId: professionalId || '',
      ...(currentFlow !== 'professional'
        ? { page: filters.page, limit: filters.limit }
        : { ...filters }),
    },

    {
      skip: currentFlow !== 'professional',
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    },
  )

  const isLoading = isLoadingServices || isLoadingOffers
  const isError = isErrorServices || isErrorOffers
  const error = servicesError || offersError

  const servicesData = useMemo(
    () =>
      Array.isArray(getServicesResponse?.data) ? getServicesResponse.data : [],
    [getServicesResponse?.data],
  )

  const services = useMemo(() => {
    const normalizeServices = () => {
      if (currentFlow === 'service') {
        return servicesData.map((service) => ({
          id: `${service.id}`,
          service,
        }))
      }

      return Array.isArray(offersData?.professional.offers)
        ? offersData?.professional.offers
        : []
    }

    return normalizeServices()
  }, [currentFlow, servicesData, offersData?.professional.offers])

  useEffect(() => {
    const { categories, categoryFlow } = categoryCalculation

    const shouldRecalculateCategories =
      filters.category === '' &&
      filters.q === '' &&
      (categories.length === 0 || categoryFlow !== currentFlow)

    if (!shouldRecalculateCategories) return
    const extractCategories = (data: typeof services) => {
      const uniqueCategories = new Set<string>()
      data.forEach(({ service }) => {
        if (service.category) {
          uniqueCategories.add(service.category)
        }
      })
      return Array.from(uniqueCategories)
    }

    if (services) {
      setCategoryCalculation({
        categories: extractCategories(services),
        categoryFlow: currentFlow,
      })
    }
  }, [services, filters.category, filters.q, currentFlow])

  return {
    isLoading,
    isError,
    error,
    services,
    categories: categoryCalculation.categories,
    filters,
    setFilters,
  }
}
