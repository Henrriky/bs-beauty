import Modal from '../../../components/modal/Modal'
import { RolePermissionsManager } from './RolePermissionsManager'
import { Role } from '../types'

interface RolePermissionsModalProps {
  isOpen: boolean
  role: Role | null
  onClose: () => void
}

export function RolePermissionsModal({
  isOpen,
  role,
  onClose,
}: RolePermissionsModalProps) {
  if (!role) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gerenciar Permissões`}
      size="lg"
    >
      <div className="p-6">
        <RolePermissionsManager roleId={role.id} roleName={role.name} />
      </div>
    </Modal>
  )
}
