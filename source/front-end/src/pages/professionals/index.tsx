import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import { Button } from '../../components/button/Button'
import SearchInput from '../../components/inputs/SearchInput'
import { Pagination } from '../../components/select/Pagination'
import { PageHeader } from '../../layouts/PageHeader'
import { UserType } from '../../store/auth/types'
import { DeleteProfessionalModal } from './components/DeleteProfessionalModal'
import { ProfessionalFormModal } from './components/ProfessionalFormModal'
import { ProfessionalList } from './components/ProfessionalList'
import { ProfessionalRolesModal } from './components/ProfessionalRolesModal'
import { useProfessionalsLogic } from './hooks/useProfessionalsLogic'
import { EditCommissionModal } from './components/EditCommissionModal'

function Professionals() {
  const [searchTerm, setSearchTerm] = useState('')

  const {
    professionals,
    pagination,
    filters,
    selectedProfessional,
    professionalToDelete,
    professionalToManageRoles,
    professionalToEditCommission,
    isLoadingProfessionals,
    isCreating,
    isDeleting,
    isUpdatingCommission,
    isFormModalOpen,
    isDeleteModalOpen,
    isRolesModalOpen,
    isCommissionModalOpen,
    handlePageChange,
    handleFiltersChange,
    clearFilters,
    openCreateModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    openRolesModal,
    closeRolesModal,
    openCommissionModal,
    closeCommissionModal,
    handleCreateProfessional,
    handleDeleteProfessional,
    handleUpdateCommission,
  } = useProfessionalsLogic()

  const handleSearch = (value: string) => {
    handleFiltersChange({
      ...filters,
      email: value || undefined,
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gerenciamento de Profissionais"
        subtitle="Aqui você pode gerenciar os profissionais cadastrados na plataforma."
      />
      <UserCanAccessContainer
        allowedPermissions={['professional.read']}
        allowedUserTypes={[UserType.MANAGER]}
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
              placeholder="Digite o e-mail do funcionário..."
              aria-label="Pesquisar por e-mail do funcionário"
            />
          </div>
        </div>

        {/* Professional List */}
        <ProfessionalList
          professionals={professionals}
          isLoading={isLoadingProfessionals}
          onDelete={openDeleteModal}
          onManageProfessionalRoles={openRolesModal}
          onEditCommission={openCommissionModal}
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

      <UserCanAccessContainer
        allowedPermissions={['professional.create']}
        allowedUserTypes={[UserType.MANAGER]}
      >
        {/* Create Button */}
        <Button
          onClick={openCreateModal}
          variant="solid"
          label={
            <div className="flex items-center justify-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Criar funcionário
            </div>
          }
          className="w-full"
        />
      </UserCanAccessContainer>

      {/* Create Modal */}
      <ProfessionalFormModal
        isOpen={isFormModalOpen}
        professional={selectedProfessional}
        isLoading={isCreating}
        onClose={closeFormModal}
        onSubmit={handleCreateProfessional}
      />

      {/* Delete Modal */}
      <DeleteProfessionalModal
        isOpen={isDeleteModalOpen}
        professional={professionalToDelete}
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteProfessional}
      />

      {/* User Roles Modal */}
      <ProfessionalRolesModal
        isOpen={isRolesModalOpen}
        professional={professionalToManageRoles}
        onClose={closeRolesModal}
      />

      {/* Edit Commission Modal */}
      <EditCommissionModal
        isOpen={isCommissionModalOpen}
        professional={professionalToEditCommission}
        isLoading={isUpdatingCommission}
        onClose={closeCommissionModal}
        onSubmit={handleUpdateCommission}
      />
    </div>
  )
}

export default Professionals
