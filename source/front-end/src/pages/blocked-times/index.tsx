import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '../../components/button/Button'
import SearchInput from '../../components/inputs/SearchInput'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import { Pagination } from '../../components/select/Pagination'
import { useBlockedTimesLogic } from './hooks/useBlockedTimesLogic'
import { BlockedTimesList } from './components/BlockedTimeList'
import { BlockedTimeFormModal } from './components/BlockedTimeFormModal'
import { DeleteBlockedTimeModal } from './components/DeleteBlockedTimeModal'
// import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'

export default function BlockedTimes() {
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const {
    blockedtimes,
    pagination,
    filters,
    selectedBlockedTime,
    blockedtimeToDelete,
    isLoadingBlockedTimes,
    isCreating,
    isUpdating,
    isDeleting,
    isFormModalOpen,
    isDeleteModalOpen,
    handlePageChange,
    handleFiltersChange,
    clearFilters,
    openCreateModal,
    openEditModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateBlockedTime,
    handleUpdateBlockedTime,
    handleDeleteBlockedTime,
  } = useBlockedTimesLogic()

  const handleSearch = (value: string) => {
    handleFiltersChange({
      ...filters,
      reason: value || undefined,
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    clearFilters()
  }

  const canManageBlockedTimes = user?.userType === UserType.MANAGER

  if (!canManageBlockedTimes) {
    return (
      <div className="p-6">
        <div className="bg-primary-800 rounded-2xl p-12 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-primary-0 mb-2">
            Acesso Negado
          </h2>
          <p className="text-primary-200">
            Você não tem permissão para acessar esta funcionalidade.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Title align="left">Gerenciamento de Bloqueio de Horário</Title>
      </div>
      {/* Filters and BlockedTimes List */}
      {/* <UserCanAccessContainer
        allowedPermissions={['blockedtimes.read']}
        allowedUserTypes={[UserType.MANAGER]}
      > */}
      {/* Filters */}
      <div className="bg-primary-800 rounded-2xl p-6">
        <div>
          <label className="block text-sm font-medium text-primary-0 mb-2">
            Buscar por nome
          </label>
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            onSearch={handleSearch}
            enableDebouncing={false}
            placeholder="Digite o motivo do bloqueio..."
            aria-label="Buscar por nome do bloqueio de horário"
          />
        </div>

        {/* Active Filters */}
        {filters.reason && (
          <div className="mt-4 pt-4 border-t border-primary-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-primary-200">Filtros ativos:</span>
              {filters.reason && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-secondary-600 text-secondary-100">
                  Nome: {filters.reason}
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      handleFiltersChange({ ...filters, reason: undefined })
                    }}
                    className="ml-1.5 text-secondary-200 hover:text-secondary-100"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* BlockedTimes List */}
      <BlockedTimesList
        blockedtimes={blockedtimes}
        isLoading={isLoadingBlockedTimes}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />
      {/* Pagination */}
      <Pagination
        totalItems={pagination.totalItems}
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
        pageLimit={pagination.pageLimit}
        onPageChange={handlePageChange}
      />
      {/* </UserCanAccessContainer> */}

      {/* Create BlockedTime */}
      {/* <UserCanAccessContainer
        allowedPermissions={['blockedtimes.create']}
        allowedUserTypes={[UserType.MANAGER]}
      > */}
      <Button
        onClick={openCreateModal}
        variant="solid"
        label={
          <div className="flex items-center justify-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Criar Bloqueio de Horário
          </div>
        }
        className="w-full"
      />
      {/* </UserCanAccessContainer> */}

      {/* Modals */}
      <BlockedTimeFormModal
        isOpen={isFormModalOpen}
        blockedtime={selectedBlockedTime}
        isLoading={isCreating || isUpdating}
        onClose={closeFormModal}
        onSubmit={
          selectedBlockedTime
            ? handleUpdateBlockedTime
            : handleCreateBlockedTime
        }
      />

      {/* Delete Modal */}
      <DeleteBlockedTimeModal
        isOpen={isDeleteModalOpen}
        blockedtime={blockedtimeToDelete}
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteBlockedTime}
      />
    </div>
  )
}
