import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { serviceAPI } from '../../../store/service/service-api'
import { Service } from '../../../store/service/types'

interface DeleteServiceWarnInputProps {
  service: Service
  onClose: () => void
}

function DeleteServiceWarn({ service, onClose }: DeleteServiceWarnInputProps) {
  const [deleteService] = serviceAPI.useDeleteServiceMutation()
  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId)
        .unwrap()
        .then(() => toast.success('Serviço deletado com sucesso!'))
    } catch (error) {
      console.error('Erro ao deletar o serviço:', error)
      toast.error('Ocorreu um erro ao deletar o serviço.')
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-evenly">
      <p className="text-[#D9D9D9] text-xl text-center mb-4">
        Tem certeza que deseja <br /> excluir o serviço?
      </p>
      <div className="flex gap-10">
        <Button
          label="Sim"
          onClick={() => {
            handleDelete(service.id)
            onClose()
          }}
        />
        <Button label="Não" variant="outline" onClick={() => onClose()} />
      </div>
    </div>
  )
}

export default DeleteServiceWarn
