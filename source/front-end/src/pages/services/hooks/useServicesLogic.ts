import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import useAppSelector from '../../../hooks/use-app-selector'
import { serviceAPI } from '../../../store/service/service-api'
import { OnSubmitUpdateServiceStatusForm } from '../components/types'
import { useUserCanAccess } from '../../../hooks/authorization/use-user-can-access'
import { UserType } from '../../../store/auth/types'

export function useServicesLogic() {
  const { id: loggedUserId } = useAppSelector((state) => state.auth.user!)

  const {
    data,
    isLoading: isLoadingServices,
    isError: isErrorLoadingServices,
  } = serviceAPI.useGetServicesQuery({
    page: 1,
    limit: 50,
  })

  const [updateService, { isLoading: isUpdatingServiceStatus }] =
    serviceAPI.useUpdateServiceMutation()

  const userHasPermissionToApprove = useUserCanAccess({
    allowedPermissions: ['service.approve'],
    allowedUserTypes: [UserType.MANAGER],
  })

  const services = useMemo(() => {
    if (!data) return []

    const filteredService = userHasPermissionToApprove
      ? data.data
      : data.data.filter(
          (service) =>
            service.status === 'APPROVED' || service.createdBy === loggedUserId,
        )

    return [...filteredService].sort((a, b) => {
      const statusOrder = { APPROVED: 1, PENDING: 2, REJECTED: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    })
  }, [data, loggedUserId, userHasPermissionToApprove])

  const handleChangeServiceStatus = useCallback(
    (serviceId: string): OnSubmitUpdateServiceStatusForm => {
      return async ({ status }) => {
        try {
          await updateService({ data: { status }, id: serviceId }).unwrap()
          toast.success('Serviço atualizado com sucesso!')
        } catch (error: unknown) {
          console.error('Error trying to update offer', error)
          toast.error('Ocorreu um erro ao atualizar o serviço.')
        }
      }
    },
    [updateService],
  )
  return {
    loggedUserId,
    services,
    isLoadingServices,
    isErrorLoadingServices,
    userHasPermissionToApprove,
    isUpdatingServiceStatus,
    handleChangeServiceStatus,
  }
}
