import {
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import Title from '../../components/texts/Title'
import useAppSelector from '../../hooks/use-app-selector'
import { UserType } from '../../store/auth/types'
import InfoCard from './components/InfoCard'
import { Button } from '../../components/button/Button'
import { salonInfoAPI } from '../../store/salon-info/salon-info-api'
import {
  OnSubmitSalonInfoUpdateFormData,
  SalonInfoUpdateFormData,
} from './types'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SalonInfoSchemas } from '../../utils/validation/zod-schemas/salon-info.zod-schemas.validation.utils'
import { Formatter } from '../../utils/formatter/formatter.util'

function SalonInfo() {
  const user = useAppSelector((state) => state.auth.user!)
  const isManager = user.userType === UserType.MANAGER

  const salonInfo = salonInfoAPI.useFetchSalonInfoQuery(1)
  const salonInfoData = salonInfo.data

  const [updateSalonInfo, { isLoading }] =
    salonInfoAPI.useUpdateSalonInfoMutation()

  const handleSubmitUpdateSalonInfo: OnSubmitSalonInfoUpdateFormData = async (
    salonInfoData,
  ) => {
    console.log(salonInfoData)
    await updateSalonInfo({ data: salonInfoData, id: 1 })
      .unwrap()
      .then(() => toast.success('Informações atualizadas!'))
      .catch((error: unknown) => {
        console.error('Error trying to update salon info', error)
        toast.error('Ocorreu um erro ao atualizar as informações.')
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalonInfoUpdateFormData>({
    resolver: zodResolver(SalonInfoSchemas.updateSchema),
    values: {
      salonAddress: salonInfoData?.salonAddress || undefined,
      salonEmail: salonInfoData?.salonEmail || undefined,
      salonPhoneNumber: salonInfoData?.salonPhoneNumber || undefined,
      openingHours: salonInfoData?.openingHours || undefined,
      minimumAdvanceTime: salonInfoData?.minimumAdvanceTime || undefined,
    },
  })

  if (salonInfo.isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando informações...
      </p>
    )
  }

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
      <form
        className="flex flex-col gap-2 text-primary-0"
        onSubmit={handleSubmit(handleSubmitUpdateSalonInfo)}
      >
        <InfoCard
          name="Horários de funcionamento"
          icon={<ClockIcon className="size-5" />}
          inputInfos={[
            {
              label: 'Segunda à Sexta',
              inputType: 'time',
              fieldName: 'openingHours',
            },
            {
              label: 'Sábado',
              inputType: 'time',
              fieldName: 'openingHours',
            },
            {
              label: 'Domingo',
              inputType: 'time',
              fieldName: 'openingHours',
            },
          ]}
          showAddNewButton={false}
          register={register}
          salonData={salonInfoData}
        />
        <InfoCard
          name="Antecedência mínima"
          icon={<CalendarIcon className="size-5" />}
          inputInfos={[
            {
              label: 'Tempo mínimo de antecedência',
              inputType: 'text',
              fieldName: 'minimumAdvanceTime',
              error: errors?.minimumAdvanceTime?.message?.toString(),
            },
          ]}
          register={register}
          showAddNewButton={false}
        />
        <InfoCard
          name="Endereço do salão"
          icon={<MapPinIcon className="size-5" />}
          inputInfos={[
            {
              label: 'Endereço completo',
              inputType: 'text',
              fieldName: 'salonAddress',
              error: errors?.salonAddress?.message?.toString(),
            },
          ]}
          showAddNewButton={false}
          register={register}
        />
        <InfoCard
          name="Contatos"
          icon={<EnvelopeIcon className="size-5" />}
          inputInfos={[
            {
              label: 'E-mail',
              inputType: 'text',
              fieldName: 'salonEmail',
              error: errors.salonEmail?.message?.toString(),
            },
            {
              label: 'Telefone',
              inputType: 'tel',
              fieldName: 'salonPhoneNumber',
              error: errors.salonPhoneNumber?.message?.toString(),
              onChange: (e) => {
                const value = Formatter.formatPhoneNumber(e.target.value)
                e.target.value = value
              },
            },
          ]}
          showAddNewButton={false}
          register={register}
        />
        {isManager && (
          <Button
            type="submit"
            label={
              isLoading ? (
                <div className="flex justify-center items-center gap-4">
                  <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  <p className="text-sm">Salvando...</p>
                </div>
              ) : (
                'Salvar alterações'
              )
            }
            disabled={false}
          />
        )}
      </form>
    </div>
  )
}

export default SalonInfo
