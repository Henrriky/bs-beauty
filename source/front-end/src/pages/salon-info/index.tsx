import {
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import InfoCard from './components/InfoCard'
import { Button } from '../../components/button/Button'

function SalonInfo() {
  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user.userType === UserType.MANAGER

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Title align={'left'}>Informações do Salão</Title>
        <p className="text-primary-200 text-sm">
          {isManager
            ? 'Atualize aqui as informações do seu salão para que clientes possam encontrá-lo e conhecer seus serviços.'
            : 'Confira as informações do salão, incluindo endereço, telefone e horários de funcionamento. Tudo o que você precisa saber para planejar sua visita.'}
        </p>
      </div>
      <form className="flex flex-col gap-2 text-primary-0">
        <InfoCard
          name="Horários de funcionamento"
          icon={<ClockIcon className="size-5" />}
          inputInfos={[
            {
              label: 'Segunda à Sexta',
              inputType: 'time',
            },
            {
              label: 'Sábado',
              inputType: 'time',
            },
          ]}
          showAddNewButton={false}
        />
        <InfoCard
          name="Endereço do salão"
          icon={<MapPinIcon className="size-5" />}
          inputInfos={[
            {
              label: 'Endereço completo',
              inputType: 'text',
            },
          ]}
          showAddNewButton={false}
        />
        <InfoCard
          name="Contatos"
          icon={<EnvelopeIcon className="size-5" />}
          inputInfos={[
            {
              label: 'E-mail',
              inputType: 'text',
            },
            {
              label: 'Telefone',
              inputType: 'tel',
            },
          ]}
          showAddNewButton={false}
        />
        <Button
          type="submit"
          label="Salvar alterações"
          // label={
          //   isLoading ? (
          //     <div className="flex justify-center items-center gap-4">
          //       <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
          //       <p className="text-sm">Salvar</p>
          //     </div>
          //   ) : (
          //     'Salvar'
          //   )
          // }
          className=""
          disabled={false}
        />
      </form>
    </div>
  )
}

export default SalonInfo
