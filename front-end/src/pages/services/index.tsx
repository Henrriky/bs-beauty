import { SetStateAction, useState } from 'react'
import GoBackButton from '../../components/button/GoBackButton'
import Title from '../../components/texts/Title'
import CreateServiceForm from './components/CreateServiceForm'
import ExpansiveItem from './components/ExpansiveItem'
import ListServices from './components/ListServices'
import Modal from './components/Modal'
import { Service } from '../../store/service/types'
import CreateOfferForm from './components/CreateOfferForm'
import { authAPI } from '../../store/auth/auth-api'
import { Role } from '../../store/auth/types'

function ServiceDashboard() {
  const [openModal, setOpenModal] = useState(false)
  const [expandedDiv, setExpandedDiv] = useState(null)
  const [service, setService] = useState()
  const { data } = authAPI.useFetchUserInfoQuery()
  const isManager = data?.user.role === Role.MANAGER
  const employeeId = data?.user.id

  const toggleDiv = (div: string | SetStateAction<null>) => {
    if (expandedDiv === div) {
      setExpandedDiv(null)
      return
    }
    setExpandedDiv(div as SetStateAction<null>)
  }

  return (
    <>
      <GoBackButton />
      <div className="w-full">
        <div>
          <Title align="left">Serviços</Title>
          <p className="text-[#979797] text-sm mt-2">
            Selecione algum serviço já criado ou crie o seu caso não exista.
          </p>
        </div>
        <div className="w-full">
          <ExpansiveItem
            text="Serviços já criados"
            node={
              <ListServices
                openModal={() => setOpenModal(true)}
                selectService={(service) => setService(service)}
              />
            }
            div="div1"
            expandedDiv={expandedDiv}
            toggleDiv={() => toggleDiv('div1')}
          />
          {isManager && (
            <ExpansiveItem
              text="Criar serviço"
              node={<CreateServiceForm />}
              div="div2"
              expandedDiv={expandedDiv}
              toggleDiv={() => toggleDiv('div2')}
            />
          )}
        </div>
      </div>
      <div className="absolute top-[0px]">
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          service={service as unknown as Service}
        >
          <CreateOfferForm
            service={service as unknown as Service}
            employeeId={employeeId}
          />
        </Modal>
      </div>
    </>
  )
}

export { ServiceDashboard }
