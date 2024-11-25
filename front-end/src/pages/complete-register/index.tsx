import Title from '../../components/texts/Title'
import { Role } from '../../store/auth/types'
import useAppSelector from '../../hooks/use-app-selector'
import CustomerInputContainer from './components/CustomerInputContainer'
import EmployeeInputContainer from './components/EmployeeInputContainer'
import { OnSubmitEmployeeOrCustomerForm } from './components/types'
import { authAPI } from '../../store/auth/auth-api'

const rolesToInputContainers = {
  [Role.CUSTOMER]: CustomerInputContainer,
  [Role.EMPLOYEE]: EmployeeInputContainer,
  [Role.MANAGER]: () => <></>,
}

function CompleteRegister() {
  const [completeRegister, { isError, isSuccess, isLoading }] =
    authAPI.useCompleteRegisterMutation()

  const userRole = useAppSelector((state) => state.auth.user!.role)
  const InputContainer = rolesToInputContainers[userRole]

  const handleSubmit: OnSubmitEmployeeOrCustomerForm = async (data) => {
    await completeRegister(data)
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12">
      <Title align="center">Quase lá, finalize seu cadastro</Title>
      <InputContainer handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default CompleteRegister
