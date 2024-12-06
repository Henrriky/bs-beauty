import GoBackButton from '../../components/button/GoBackButton'
import Title from '../../components/texts/Title'
import { serviceAPI } from '../../store/service/service-api'
import CreateServiceForm from './components/CreateServiceForm'
import ExpansiveItem from './components/ExpansiveItem'
import NewComponent from './components/NewComponent'
import { OnSubmitCreateServiceForm } from './components/types'

function ServiceDashboard() {
  const [createService, { isLoading }] = serviceAPI.useCreateServiceMutation()

  const handleSubmit: OnSubmitCreateServiceForm = async (data) => {
    await createService(data).unwrap()
  }

  return (
    <div className="flex flex-col h-full gap-12 animate-fadeIn">
      <GoBackButton />
      <div>
        <div className="relative top-[40px] left-[18px] max-w-[340px]">
          <Title align="left">Serviços</Title>
          <p className="text-[#979797] text-sm mt-2">
            Selecione algum serviço já criado ou crie o seu caso não exista.
          </p>
        </div>
        <div className="">
          <ExpansiveItem
            text="Oferecer um serviço já criado"
            top="70px"
            node={<NewComponent />}
          />
          <ExpansiveItem
            text="Criar serviço"
            top="80px"
            node={
              <CreateServiceForm
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export { ServiceDashboard }
