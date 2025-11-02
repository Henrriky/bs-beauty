import { useState } from 'react'
import { toast } from 'react-toastify'
import Title from '../../components/texts/Title'
import { notificationTemplateAPI } from '../../store/notification-template/notification-template-api'
import { NotificationTemplate } from '../../store/notification-template/types'
import NotificationTemplateEditorModal from './components/NotificationTemplateEditorModal'
import NotificationTemplateList from './components/NotificationTemplateList'
import { buildExampleVariables } from './utils/variable-examples'

function NotificationTemplates() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, refetch } =
    notificationTemplateAPI.useFetchNotificationTemplatesQuery({
      page: 1,
      limit: 10,
    })

  const [updateNotificationTemplate, { isLoading: isSaving }] =
    notificationTemplateAPI.useUpdateNotificationTemplateMutation()

  const templates = data?.data ?? []

  const openModal = (tpl: NotificationTemplate) => {
    setSelectedTemplate(tpl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTemplate(null)
  }

  const handleSave = async (payload: { title: string; body: string }) => {
    if (!selectedTemplate) return

    try {
      await updateNotificationTemplate({
        key: selectedTemplate.key,
        title: payload.title,
        body: payload.body,
      }).unwrap()

      toast.success('Modelo atualizado com sucesso!')
      closeModal()
    } catch (e) {
      console.error(e)
      toast.error('Não foi possível atualizar o modelo.')
    }
  }

  const exampleVariables = buildExampleVariables(selectedTemplate)

  return (
    <>
      <Title align="left">Comunicação</Title>
      <p className="text-[#979797] text-sm mt-2">
        Configure e gerencie os modelos usados nas notificações automáticas da
        plataforma.
      </p>

      <NotificationTemplateList
        templates={templates}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onEdit={openModal}
      />

      <NotificationTemplateEditorModal
        isOpen={isModalOpen}
        template={selectedTemplate}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={handleSave}
        variableExamples={exampleVariables}
      />
    </>
  )
}

export default NotificationTemplates
