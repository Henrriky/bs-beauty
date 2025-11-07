import { Professional } from '../../../store/auth/types'
import { ProfessionalCard } from './ProfessionalCard'

interface ProfessionalListProps {
  professionals: Professional[]
  isLoading: boolean
  onDelete: (professional: Professional) => void
  onManageProfessionalRoles: (professional: Professional) => void
}

function ProfessionalList({
  professionals,
  isLoading,
  onDelete,
  onManageProfessionalRoles,
}: ProfessionalListProps) {
  if (isLoading) return <ProfessionalListSkeleton />
  if (professionals.length === 0) return <ProfessionalListEmpty />

  return (
    <div className="flex items-center flex-col gap-6 px-2">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          professional={professional}
          onDelete={onDelete}
          onManageProfessionalRoles={onManageProfessionalRoles}
        />
      ))}
    </div>
  )
}

function ProfessionalListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-primary-800 rounded-2xl p-4 animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-primary-600 rounded w-24 mb-2"></div>
                <div className="h-3 bg-primary-600 rounded w-32"></div>
              </div>
              <div className="h-6 bg-primary-600 rounded-full w-16"></div>
            </div>
            <div className="border-t border-primary-600 pt-3">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-primary-600 rounded w-20"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-primary-600 rounded"></div>
                  <div className="h-8 w-8 bg-primary-600 rounded"></div>
                </div>
              </div>
            </div>
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
