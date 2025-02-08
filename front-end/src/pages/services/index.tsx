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
import useAppSelector from '../../hooks/use-app-selector'
import ListOffers from './components/ListOffers'
import UpdateOfferForm from './components/UpdateOfferForm'
import { Offer } from '../../store/offer/types'
import DeleteOfferWarn from './components/DeleteOfferWarn'
import DeleteServiceWarn from './components/DeleteServiceWarn'
import UpdateServiceForm from './components/UpdateServiceForm'

function ServiceDashboard() {
  const [openCreateOfferModal, setOpenCreateOfferModal] = useState(false)
  const [openUpdateOfferModal, setOpenUpdateOfferModal] = useState(false)
  const [openDeleteOfferModal, setOpenDeleteOfferModal] = useState(false)
  const [openDeleteServiceModal, setOpenDeleteServiceModal] = useState(false)
  const [openUpdateServiceModal, setOpenUpdateServiceModal] = useState(false)

  const [expandedDiv, setExpandedDiv] = useState(null)
  const [service, setService] = useState<Service>()
  const [offer, setOffer] = useState<Offer>()
  const { data } = authAPI.useFetchUserInfoQuery()
  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user.role === Role.MANAGER
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
      <div className="w-full">
        <div>
          <Title align="left">Serviços</Title>
          <p className="text-[#979797] text-sm mt-2">
            {isManager
              ? 'Selecione algum serviço já criado para ofertar ou crie um caso não exista.'
              : 'Selecione algum serviço já criado para ofertar.'}
          </p>
        </div>
        <div className="w-full">
          <ExpansiveItem
            text="Serviços já criados"
            node={
              <ListServices
                openModal={() => setOpenCreateOfferModal(true)}
                selectService={(service) => setService(service)}
                isManager={isManager}
                openDeleteModal={() => setOpenDeleteServiceModal(true)}
                openUpdateModal={() => setOpenUpdateServiceModal(true)}
              />
            }
            div="div1"
            expandedDiv={expandedDiv}
            toggleDiv={() => toggleDiv('div1')}
          />
          <ExpansiveItem
            text="Ofertas criadas"
            node={
              <ListOffers
                employeeId={employeeId as string}
                openUpdateModal={() => setOpenUpdateOfferModal(true)}
                openDeleteModal={() => setOpenDeleteOfferModal(true)}
                selectOffer={(offer) => setOffer(offer)}
              />
            }
            div="div2"
            expandedDiv={expandedDiv}
            toggleDiv={() => toggleDiv('div2')}
          />
          {isManager && (
            <ExpansiveItem
              text="Criar serviço"
              node={<CreateServiceForm />}
              div="div3"
              expandedDiv={expandedDiv}
              toggleDiv={() => toggleDiv('div3')}
            />
          )}
        </div>
      </div>
      <div className="absolute top-[0px]">
        <Modal
          isOpen={openCreateOfferModal}
          onClose={() => setOpenCreateOfferModal(false)}
        >
          <CreateOfferForm
            service={service as unknown as Service}
            onClose={() => setOpenCreateOfferModal(false)}
            employeeId={employeeId}
          />
        </Modal>
        <Modal
          isOpen={openUpdateOfferModal}
          onClose={() => setOpenUpdateOfferModal(false)}
        >
          <UpdateOfferForm
            offer={offer as unknown as Offer}
            onClose={() => setOpenUpdateOfferModal(false)}
          />
        </Modal>
        <Modal
          isOpen={openDeleteOfferModal}
          onClose={() => setOpenDeleteOfferModal(false)}
        >
          <DeleteOfferWarn
            offer={offer as unknown as Offer}
            onClose={() => setOpenDeleteOfferModal(false)}
          />
        </Modal>
        <Modal
          isOpen={openDeleteServiceModal}
          onClose={() => setOpenDeleteServiceModal(false)}
        >
          <DeleteServiceWarn
            service={service as unknown as Service}
            onClose={() => setOpenDeleteServiceModal(false)}
          />
        </Modal>
        <Modal
          isOpen={openUpdateServiceModal}
          onClose={() => setOpenUpdateServiceModal(false)}
          className="max-w-[343px] max-h-[390px]"
        >
          <UpdateServiceForm
            service={service as unknown as Service}
            onClose={() => setOpenUpdateServiceModal(false)}
          />
        </Modal>
      </div>
    </>
  )
}

export { ServiceDashboard }
