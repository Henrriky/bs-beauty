// import { useState } from 'react'
import { useState } from 'react'
import GoBackButton from '../../components/button/GoBackButton'
import Title from '../../components/texts/Title'
import { serviceAPI } from '../../store/service/service-api'
import CreateServiceForm from './components/CreateServiceForm'
import ExpansiveItem from './components/ExpansiveItem'
import ListServices from './components/ListServices'
import { OnSubmitCreateServiceForm } from './components/types'

function ServiceDashboard() {
  const [createService, { isLoading }] = serviceAPI.useCreateServiceMutation()

  const handleSubmit: OnSubmitCreateServiceForm = async (data) => {
    await createService(data).unwrap()
  }

  const [expandedDiv, setExpandedDiv] = useState(null)

  const toggleDiv = (div) => {
    if (expandedDiv === div) {
      setExpandedDiv(null)
      return
    }
    setExpandedDiv(div)
  }

  return (
    <>
      <GoBackButton />
      <div className="flex flex-col h-full gap-12 animate-fadeIn">
        <div>
          <div className="max-w-[340px]">
            <Title align="left">Serviços</Title>
            <p className="text-[#979797] text-sm mt-2">
              Selecione algum serviço já criado ou crie o seu caso não exista.
            </p>
          </div>
          <div>
            <ExpansiveItem
              text="Oferecer um serviço já criado"
              top="70px"
              node={<ListServices />}
              div="div1"
              expandedDiv={expandedDiv}
              toggleDiv={() => toggleDiv('div1')}
              // isTheOtherExpanded={isTheOtherExpanded}
              // shrinkOther={handleShrink}
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
              div="div2"
              expandedDiv={expandedDiv}
              toggleDiv={() => toggleDiv('div2')}
              // isTheOtherExpanded={!isTheOtherExpanded}
              // shrinkOther={handleShrink}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export { ServiceDashboard }
