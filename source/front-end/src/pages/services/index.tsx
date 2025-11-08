import { SetStateAction, useState } from 'react'
import { UserCanAccessContainer } from '../../components/authorization/UserCanAccessContainer'
import useAppSelector from '../../hooks/use-app-selector'
import { PageHeader } from '../../layouts/PageHeader'
import { authAPI } from '../../store/auth/auth-api'
import { UserType } from '../../store/auth/types'
import { Offer } from '../../store/offer/types'
import { Service } from '../../store/service/types'
import { userCanAccess } from '../../utils/authorization/authorization.utils'
import CreateOfferForm from './components/CreateOfferForm'
import CreateServiceForm from './components/CreateServiceForm'
import DeleteOfferWarn from './components/DeleteOfferWarn'
import DeleteServiceWarn from './components/DeleteServiceWarn'
import ExpansiveItem from './components/ExpansiveItem'
import ListOffers from './components/ListOffers'
import ListServices from './components/ListServices'
import Modal from './components/Modal'
import UpdateOfferForm from './components/UpdateOfferForm'
import UpdateServiceForm from './components/UpdateServiceForm'

function ServiceDashboard() {
  const [openCreateOfferModal, setOpenCreateOfferModal] = useState(false)
  const [openUpdateOfferModal, setOpenUpdateOfferModal] = useState(false)
  const [openDeleteOfferModal, setOpenDeleteOfferModal] = useState(false)
  const [openDeleteServiceModal, setOpenDeleteServiceModal] = useState(false)
  const [openUpdateServiceModal, setOpenUpdateServiceModal] = useState(false)

  const [expandedDiv, setExpandedDiv] = useState(null)
  const [service, setService] = useState<Service | null>()
  const [offer, setOffer] = useState<Offer>()
  const { data } = authAPI.useFetchUserInfoQuery()
  const user = useAppSelector((state) => state.auth.user!)
  const professionalId = data?.user.id

  const toggleDiv = (div: string | SetStateAction<null>) => {
    if (expandedDiv === div) {
      setExpandedDiv(null)
      return
    }
    setExpandedDiv(div as SetStateAction<null>)
  }

  const userHasPermissionToCreate = userCanAccess({
    user,
    allowedPermissions: ['service.create'],
    allowedUserTypes: [UserType.MANAGER],
  })

  return (
    <>
      <div className="w-full">
        <PageHeader
          title="Serviços"
          subtitle={
            <>
              {userHasPermissionToCreate ? (
                <>Selecione algum serviço já criado para ofertar ou crie um caso não exista.</>
              ) : (
                <>Selecione algum serviço já criado para ofertar ou crie um caso não exista, mediante aprovação de um gerente.</>
              )}
            </>
          }
        />

        <div className="w-full">
          <ExpansiveItem
            text="Serviços já criados"
            node={
              <ListServices
                openModal={() => setOpenCreateOfferModal(true)}
                openDeleteModal={() => setOpenDeleteServiceModal(true)}
                openUpdateModal={() => setOpenUpdateServiceModal(true)}
                serviceSelected={service}
                selectService={(service) => setService(service)}
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
                professionalId={professionalId as string}
                openUpdateModal={() => setOpenUpdateOfferModal(true)}
                openDeleteModal={() => setOpenDeleteOfferModal(true)}
                selectOffer={(offer) => setOffer(offer)}
              />
            }
            div="div2"
            expandedDiv={expandedDiv}
            toggleDiv={() => toggleDiv('div2')}
          />
          <UserCanAccessContainer
            allowedPermissions={['service.create']}
            allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
          >
            <ExpansiveItem
              text="Criar serviço"
              node={<CreateServiceForm />}
              div="div3"
              expandedDiv={expandedDiv}
              toggleDiv={() => toggleDiv('div3')}
            />
          </UserCanAccessContainer>
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
            professionalId={professionalId}
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
