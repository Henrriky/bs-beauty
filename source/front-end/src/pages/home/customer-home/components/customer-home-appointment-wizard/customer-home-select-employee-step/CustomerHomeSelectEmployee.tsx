import { toast } from 'react-toastify'
import BSBeautyLoading from '../../../../../../components/feedback/Loading'
import Subtitle from '../../../../../../components/texts/Subtitle'
import { serviceAPI } from '../../../../../../store/service/service-api'
import { useFormContext } from 'react-hook-form'
import { CreateAppointmentFormData } from '../types'
import { ErrorMessage } from '../../../../../../components/feedback/ErrorMessage'
import { FaceFrownIcon } from '@heroicons/react/24/outline'
import CustomerHomeEmployeeCard from './CustomerHomeEmployeeCard'
import { employeeAPI } from '../../../../../../store/employee/employee-api'

interface Props {
  currentFlow: 'service' | 'professional'
}

function CustomerHomeSelectEmployeeContainer(props: Props) {
  const { register, watch, setValue } =
    useFormContext<CreateAppointmentFormData>()
  const serviceId = watch('serviceId')
  const serviceOfferedId = watch('serviceOfferedId')
  const employeeId = watch('employeeId')

  if (!serviceId && props.currentFlow === 'service') {
    toast.error(
      'Por favor, selecione um serviço para acessar a etapa de selecionar os funcionários',
    )

    return (
      <ErrorMessage
        message={
          'Por favor, selecione um serviço para acessar a etapa de selecionar os funcionários'
        }
      />
    )
  }

  const { data, isLoading, isError, error } =
    serviceAPI.useFetchEmployeesOfferingServiceQuery(
      { serviceId: serviceId! },
      { skip: props.currentFlow !== 'service' },
    )

  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
    isError: isErrorEmployees,
    error: employeesError,
  } = employeeAPI.useFetchEmployeesQuery(
    {},
    { skip: props.currentFlow !== 'professional' },
  )

  if (isLoading || isLoadingEmployees)
    return <BSBeautyLoading title="Carregando os funcionários..." />

  if (isError || isErrorEmployees) {
    toast.error('Erro ao carregar dados')
    console.error(`Error trying to fetch services`, error || employeesError)

    return (
      <ErrorMessage
        message={'Erro ao carregar informações. Tente novamente mais tarde.'}
      />
    )
  }

  const employeesToShow =
    props.currentFlow === 'service'
      ? (data?.employeesOfferingService.offers ?? [])
      : (employeesData?.data.map((employee) => ({
          id: `${employee.id}`,
          employee,
        })) ?? [])

  if (employeesToShow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
        <FaceFrownIcon className="h-12 w-12 mb-2" />
        <p>Nenhum funcionário disponível</p>
        {props.currentFlow === 'service' && (
          <p className="text-sm">
            Este serviço não está sendo feito por nenhum funcionário no momento
          </p>
        )}
      </div>
    )
  }

  const fieldToRegister =
    props.currentFlow === 'service' ? 'serviceOfferedId' : 'employeeId'

  const fieldToCompare =
    props.currentFlow === 'service' ? serviceOfferedId : employeeId

  return (
    <>
      <Subtitle align="left" className="text-[#A4978A] font-medium">
        Escolha o profissional do seu agendamento:
      </Subtitle>

      {employeesToShow &&
        employeesToShow.map((offerOrEmployee) => {
          const employee = offerOrEmployee.employee

          return (
            <div key={`employee-${employee.id}`}>
              <input
                className="invisible"
                type="radio"
                id={offerOrEmployee.id}
                value={offerOrEmployee.id}
                {...register(fieldToRegister)}
              />
              <CustomerHomeEmployeeCard
                isSelected={fieldToCompare === offerOrEmployee.id}
                currentFlow={props.currentFlow}
                key={offerOrEmployee.id}
                for={offerOrEmployee.id}
                {...offerOrEmployee}
                onClick={() => setValue('employeeId', employee.id)}
              />
            </div>
          )
        })}
    </>
  )
}

export default CustomerHomeSelectEmployeeContainer
