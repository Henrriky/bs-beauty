import Modal from '../../../components/modal/Modal'
import { Professional } from '../../../store/auth/types'
import { ProfessionalRolesManager } from './ProfessionalRolesManager'

interface ProfessionalRolesModalProps {
  isOpen: boolean
  onClose: () => void
  professional: Professional | null
}

export function ProfessionalRolesModal({
  isOpen,
  onClose,
  professional,
}: ProfessionalRolesModalProps) {
  if (!professional) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar Funções"
      size="lg"
    >
      <div className="p-6">
        <ProfessionalRolesManager
          professionalId={professional.id}
          professionalName={professional.name || professional.email}
          isOpen={isOpen}
        />
      </div>
    </Modal>
  )
}
