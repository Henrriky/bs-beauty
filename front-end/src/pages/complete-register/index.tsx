import Title from '../../components/texts/Title'
import { Role } from '../../store/auth/types'
import useAppSelector from '../../hooks/use-app-selector'
import CustomerInputContainer from './components/CustomerInputContainer'
import EmployeeInputContainer from './components/EmployeeInputContainer'
import { OnSubmitEmployeeOrCustomerForm } from './components/types'
import { authAPI } from '../../store/auth/auth-api'
import { toast } from 'react-toastify'
import useAppDispatch from '../../hooks/use-app-dispatch'
import { setRegisterCompleted } from '../../store/auth/auth-slice'

const rolesToInputContainers = {
  [Role.CUSTOMER]: CustomerInputContainer,
  [Role.EMPLOYEE]: EmployeeInputContainer,
  [Role.MANAGER]: () => <></>,
}

function CompleteRegister() {
  const [completeRegister, { isLoading }] = authAPI.useCompleteRegisterMutation()
  
  const dispatchRedux = useAppDispatch()
  const userRole = useAppSelector((state) => state.auth.user!.role)
  const InputContainer = rolesToInputContainers[userRole]


  //REFACTOR TODO: Extract bellow function and useEffect to an customHook
  const handleSubmit: OnSubmitEmployeeOrCustomerForm = async (data) => {
    await completeRegister(data)
      .unwrap()
      .then(() => {
        toast.success('Parabéns, seu cadastro foi concluído com sucesso!')
        dispatchRedux(
          //TODO: Improve this refreshing token by complete register route
          setRegisterCompleted()
        )
      })
      .catch((error: any) => {
        console.log('Error trying to complete register', error);
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12">
      <Title align="center">Quase lá, finalize seu cadastro</Title>
      <InputContainer handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default CompleteRegister
