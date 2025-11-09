import { Professional } from '../../../store/auth/types'
import { ProfessionalCard } from './ProfessionalCard'

interface ProfessionalListProps {
  professionals: Professional[]
  isLoading: boolean
  onDelete: (professional: Professional) => void
  onManageProfessionalRoles: (professional: Professional) => void
  onEditCommission: (professional: Professional) => void
  skeletonCount?: number          // ✅ novo (opcional)
}

function ProfessionalList({
  professionals,
  isLoading,
  onDelete,
  onManageProfessionalRoles,
  onEditCommission,
  skeletonCount = 6,             // ✅ default
}: ProfessionalListProps) {
  if (isLoading) return <ProfessionalListSkeleton count={skeletonCount} />
  if (professionals.length === 0) return <ProfessionalListEmpty />

  return (
    <div className="flex items-center flex-col gap-6 px-2">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          professional={professional}
          onDelete={onDelete}
          onManageProfessionalRoles={onManageProfessionalRoles}
          onEditCommission={onEditCommission}
        />
      ))}
    </div>
  )
}

function ProfessionalListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex items-center flex-col gap-6 px-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-start justify-between gap-3 bg-[#222222] w-full text-left px-6 py-6 rounded-2xl"
        >
          <div className="flex-1 min-w-0">
            <div className="h-5 w-40 bg-[#3A3A3A] rounded mb-2" />
            <div className="h-4 w-64 bg-[#3A3A3A] rounded" />
            <div className="flex items-center gap-2 mt-4">
              <div className="h-4 w-4 rounded bg-[#3A3A3A]" />
              <div className="h-4 w-28 bg-[#3A3A3A] rounded" />
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <div className="h-8 w-8 rounded bg-[#3A3A3A]" />
            <div className="h-8 w-8 rounded bg-[#3A3A3A]" />
            <div className="h-8 w-8 rounded bg-[#3A3A3A]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfessionalListEmpty() {
  return (
    <div>
      <p className="text-primary-100 text-lg mb-2 text-center">
        Nenhum professional encontrado
      </p>
      <p className="text-primary-200 text-sm text-center">
        Tente ajustar os filtros ou criar um novo professional
      </p>
    </div>
  )
}

export { ProfessionalList }
