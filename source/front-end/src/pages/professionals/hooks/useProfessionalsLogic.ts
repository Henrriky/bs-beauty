import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import {
  useDeleteProfessionalMutation,
  useFetchProfessionalsQuery,
  useInsertProfessionalMutation,
} from '../../../store/professional/professional-api'
import { CreateProfessionalFormData, GetProfessionalsFiters } from '../types'
import { Professional } from '../../../store/auth/types'
import { translateProfessionalAPIError } from '../../../store/professional/utils'

interface UseProfessionalsLogicProps {
  initialPage?: number
  initialLimit?: number
}

export function useProfessionalsLogic({
  initialPage = 1,
  initialLimit = 10,
}: UseProfessionalsLogicProps = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageLimit, setPageLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<GetProfessionalsFiters>({})
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null)
  const [professionalToDelete, setProfessionalToDelete] =
    useState<Professional | null>(null)
  const [professionalToManageRoles, setProfessionalToManageRoles] =
    useState<Professional | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false)

  // RTK Query Hooks
  const {
    data: professionalsResponse,
    isLoading: isLoadingProfessionals,
    error: professionalsError,
    refetch: refetchProfessionals,
  } = useFetchProfessionalsQuery({
    page: currentPage,
    limit: pageLimit,
    filters,
  })

  const [createProfessional, { isLoading: isCreating }] =
    useInsertProfessionalMutation()
  const [deleteProfessional, { isLoading: isDeleting }] =
    useDeleteProfessionalMutation()

  // Handlers for Pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((limit: number) => {
    setPageLimit(limit)
    setCurrentPage(1)
  }, [])

  // Handlers for filters
  const handleFiltersChange = useCallback(
    (newFilters: GetProfessionalsFiters) => {
      setFilters(newFilters)
      setCurrentPage(1)
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  /* Handlers for Create/Edit Modal */
  const openCreateModal = useCallback(() => {
    setSelectedProfessional(null)
    setIsFormModalOpen(true)
  }, [])

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setSelectedProfessional(null)
  }, [])

  /* Handlers for Delete Modal */
  const openDeleteModal = useCallback((professional: Professional) => {
    setProfessionalToDelete(professional)
    setIsDeleteModalOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setProfessionalToDelete(null)
  }, [])

  /* Handlers for create professional */
  const handleCreateProfessional = useCallback(
    async (data: CreateProfessionalFormData) => {
      try {
        const payload = {
          ...data,
          commissionRate:
            data.commissionRate !== undefined
              ? data.commissionRate / 100
              : undefined,
        }
        await createProfessional(payload).unwrap()
        toast.success('Funcionário criado com sucesso!')
        closeFormModal()
        refetchProfessionals()
      } catch (error) {
        console.error('Error deleting professional:', error)
        const message =
          (error as { data?: { message?: string } })?.data?.message ||
          'Erro inesperado ao excluir professional'
        toast.error(translateProfessionalAPIError(message))
        closeDeleteModal()
      }
    },
    [
      createProfessional,
      closeFormModal,
      refetchProfessionals,
      closeDeleteModal,
    ],
  )

  /* Handlers for delete professional */
  const handleDeleteProfessional = useCallback(async () => {
    if (!professionalToDelete) return

    try {
      await deleteProfessional(professionalToDelete.id).unwrap()
      toast.success('Funcionário excluído com sucesso!')
      closeDeleteModal()
      refetchProfessionals()
    } catch (error) {
      console.error('Error deleting role:', error)
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        'Erro inesperado ao excluir role'
      toast.error(translateProfessionalAPIError(message))
      closeDeleteModal()
    }
  }, [
    deleteProfessional,
    professionalToDelete,
    closeDeleteModal,
    refetchProfessionals,
  ])

  // Handlers para modal de roles
  const openRolesModal = useCallback((professional: Professional) => {
    setProfessionalToManageRoles(professional)
    setIsRolesModalOpen(true)
  }, [])

  const closeRolesModal = useCallback(() => {
    setIsRolesModalOpen(false)
    setProfessionalToManageRoles(null)
  }, [])

  return {
    professionals: professionalsResponse?.data || [],
    selectedProfessional,
    professionalToDelete,
    professionalToManageRoles,

    // States for Pagination and Filters
    filters,
    pagination: {
      totalItems: professionalsResponse?.total || 0,
      totalPages: professionalsResponse?.totalPages || 0,
      currentPage,
      pageLimit: 10,
    },

    // Loading States
    isLoadingProfessionals,
    isCreating,
    isDeleting,

    // Modal States
    isFormModalOpen,
    isDeleteModalOpen,
    isRolesModalOpen,

    // Errors
    professionalsError,

    // Handlers of Pagination
    handlePageChange,
    handleLimitChange,

    // Handlers of Filters
    handleFiltersChange,
    clearFilters,

    // Handlers of Modals
    openCreateModal,
    openDeleteModal,
    openRolesModal,
    closeDeleteModal,
    closeFormModal,
    closeRolesModal,

    // API Crud Handlers
    handleCreateProfessional,
    handleDeleteProfessional,

    // Utils
    refetchProfessionals,
  }
}
