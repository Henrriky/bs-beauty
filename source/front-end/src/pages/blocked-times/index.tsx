import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import { Button } from '../../components/button/Button'
import SearchInput from '../../components/inputs/SearchInput'
import { Pagination } from '../../components/select/Pagination'
import { PageHeader } from '../../layouts/PageHeader'
import { UserType } from '../../store/auth/types'
import { BlockedTimeFormModal } from './components/BlockedTimeFormModal'
import { BlockedTimesList } from './components/BlockedTimeList'
import { DeleteBlockedTimeModal } from './components/DeleteBlockedTimeModal'
import { useBlockedTimesLogic } from './hooks/useBlockedTimesLogic'

export default function BlockedTimes() {
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

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <PageHeader
        title="Gerenciamento de Bloqueio de Horário"
        subtitle={<>Gerencie os bloqueios de horário para sua agenda.</>}
      />

      {/* Filters and BlockedTimes List */}
      <UserCanAccessContainer
        strategy="ANY"
        allowedPermissions={['blocked_time.read_all', 'blocked_time.read_own']}
        allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
      >
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
                <span className="text-sm text-primary-200">
                  Filtros ativos:
                </span>
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
      </UserCanAccessContainer>

      {/* Create BlockedTime */}
      <UserCanAccessContainer
        allowedPermissions={['blocked_time.create_own']}
        allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
      >
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
      </UserCanAccessContainer>

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
