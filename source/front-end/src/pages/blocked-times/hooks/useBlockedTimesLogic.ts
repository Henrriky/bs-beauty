import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  useGetBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation,
} from '../../../store/blocked-times/blocked-times-api'
import {
  CreateBlockedTimeFormData,
  GetBlockedTimesRequestFilters,
  BlockedTime,
} from '../types'

interface UseBlockedTimesLogicProps {
  initialPage?: number
  initialLimit?: number
}

export function useBlockedTimesLogic({
  initialPage = 1,
  initialLimit = 10,
}: UseBlockedTimesLogicProps = {}) {
  // Estados locais
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageLimit, setPageLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<GetBlockedTimesRequestFilters>({})
  const [selectedBlockedTime, setSelectedBlockedTime] =
    useState<BlockedTime | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const [blockedtimeToDelete, setBlockedTimeToDelete] =
    useState<BlockedTime | null>(null)
  const [blockedtimeToManagePermissions, setBlockedTimeToManagePermissions] =
    useState<BlockedTime | null>(null)

  // RTK Query hooks
  const {
    data: blockedtimesResponse,
    isLoading: isLoadingBlockedTimes,
    error: blockedtimesError,
    refetch: refetchBlockedTimes,
  } = useGetBlockedTimesQuery({
    page: currentPage,
    limit: pageLimit,
    filters,
  })

  const [createBlockedTime, { isLoading: isCreating }] =
    useCreateBlockedTimeMutation()
  const [updateBlockedTime, { isLoading: isUpdating }] =
    useUpdateBlockedTimeMutation()
  const [deleteBlockedTime, { isLoading: isDeleting }] =
    useDeleteBlockedTimeMutation()

  // Handlers para paginação
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleLimitChange = useCallback((limit: number) => {
    setPageLimit(limit)
    setCurrentPage(1) // Reset para primeira página
  }, [])

  // Handlers para filtros
  const handleFiltersChange = useCallback(
    (newFilters: GetBlockedTimesRequestFilters) => {
      setFilters(newFilters)
      setCurrentPage(1) // Reset para primeira página
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters({})
    setCurrentPage(1)
  }, [])

  // Handlers para modal de formulário
  const openCreateModal = useCallback(() => {
    setSelectedBlockedTime(null)
    setIsFormModalOpen(true)
  }, [])

  const openEditModal = useCallback((blockedtime: BlockedTime) => {
    setSelectedBlockedTime(blockedtime)
    setIsFormModalOpen(true)
  }, [])

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false)
    setSelectedBlockedTime(null)
  }, [])

  // Handlers para modal de exclusão
  const openDeleteModal = useCallback((blockedtime: BlockedTime) => {
    setBlockedTimeToDelete(blockedtime)
    setIsDeleteModalOpen(true)
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
    setBlockedTimeToDelete(null)
  }, [])

  // Handlers para modal de permissões
  const openPermissionsModal = useCallback((blockedtime: BlockedTime) => {
    setBlockedTimeToManagePermissions(blockedtime)
    setIsPermissionsModalOpen(true)
  }, [])

  const closePermissionsModal = useCallback(() => {
    setIsPermissionsModalOpen(false)
    setBlockedTimeToManagePermissions(null)
  }, [])

  // Handler para criar blockedtime
  const handleCreateBlockedTime = useCallback(
    async (data: CreateBlockedTimeFormData) => {
      try {
        await createBlockedTime(data).unwrap()
        toast.success('Bloqueio de horário criado com sucesso!')
        closeFormModal()
        refetchBlockedTimes()
      } catch (error: unknown) {
        console.error('Error creating blocked time:', error)
        const message =
          (error as { data?: { message?: string } })?.data?.message ||
          'Erro inesperado ao criar blocked time'
        toast.error(message)
      }
    },
    [createBlockedTime, closeFormModal, refetchBlockedTimes],
  )

  // Handler para atualizar blockedtime
  const handleUpdateBlockedTime = useCallback(
    async (data: CreateBlockedTimeFormData) => {
      if (!selectedBlockedTime) return

      try {
        await updateBlockedTime({ id: selectedBlockedTime.id, data }).unwrap()
        toast.success('Bloqueio de horário atualizado com sucesso!')
        closeFormModal()
        refetchBlockedTimes()
      } catch (error: unknown) {
        console.error('Error updating blocked time:', error)
        const message =
          (error as { data?: { message?: string } })?.data?.message ||
          'Erro inesperado ao atualizar bloqueio de horário'
        toast.error(message)
      }
    },
    [
      updateBlockedTime,
      selectedBlockedTime,
      closeFormModal,
      refetchBlockedTimes,
    ],
  )

  // Handler para deletar blockedtime
  const handleDeleteBlockedTime = useCallback(async () => {
    if (!blockedtimeToDelete) return

    try {
      await deleteBlockedTime(blockedtimeToDelete.id).unwrap()
      toast.success('Bloqueio de horário excluído com sucesso!')
      closeDeleteModal()
      refetchBlockedTimes()
    } catch (error: unknown) {
      console.error('Error deleting blocked time:', error)
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        'Erro inesperado ao excluir bloqueio de horário'
      toast.error(message)
      closeDeleteModal()
    }
  }, [
    deleteBlockedTime,
    blockedtimeToDelete,
    closeDeleteModal,
    refetchBlockedTimes,
  ])

  return {
    // Estados
    blockedtimes: blockedtimesResponse?.data || [],
    pagination: {
      totalItems: blockedtimesResponse?.total || 0,
      totalPages: blockedtimesResponse?.totalPages || 0,
      currentPage,
      pageLimit,
    },
    filters,
    selectedBlockedTime,
    blockedtimeToDelete,
    blockedtimeToManagePermissions,

    // Estados de loading
    isLoadingBlockedTimes,
    isCreating,
    isUpdating,
    isDeleting,

    // Estados de modals
    isFormModalOpen,
    isDeleteModalOpen,
    isPermissionsModalOpen,

    // Errors
    blockedtimesError,

    // Handlers de paginação
    handlePageChange,
    handleLimitChange,

    // Handlers de filtros
    handleFiltersChange,
    clearFilters,

    // Handlers de modals
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    openPermissionsModal,
    closePermissionsModal,

    // Handlers de CRUD
    handleCreateBlockedTime,
    handleUpdateBlockedTime,
    handleDeleteBlockedTime,

    // Utils
    refetchBlockedTimes,
  }
}
