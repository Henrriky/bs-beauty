import { toast } from 'react-toastify'

import Title from '../../components/texts/Title'
import CustomerInputContainer from './components/CustomerInputContainer'
import EmployeeInputContainer from './components/EmployeeInputContainer'

import useAppDispatch from '../../hooks/use-app-dispatch'
import useAppSelector from '../../hooks/use-app-selector'
import { authAPI } from '../../store/auth/auth-api'
import { setRegisterCompleted } from '../../store/auth/auth-slice'

import { Role } from '../../store/auth/types'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { OnSubmitEmployeeOrCustomerForm } from './types'

const rolesToInputContainers = {
  [Role.CUSTOMER]: CustomerInputContainer,
  [Role.EMPLOYEE]: EmployeeInputContainer,
  [Role.MANAGER]: EmployeeInputContainer,
}

function CompleteRegister() {
  const navigate = useNavigate()
  const dispatchRedux = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user!)
  const [completeRegister, { isLoading }] =
    authAPI.useCompleteRegisterMutation()

  const InputContainer = rolesToInputContainers[user.role]

  // REFACTOR TODO: Extract bellow function and useEffect to an customHook
  const handleSubmit: OnSubmitEmployeeOrCustomerForm = async (data) => {
    await completeRegister(data)
      .unwrap()
      .then(() => {
        dispatchRedux(
          // TODO: Improve this refreshing token by complete register route
          setRegisterCompleted(),
        )
        navigate('/register-completed')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  useEffect(() => {
    if (user.registerCompleted) {
      toast.info(
        'Você já completou seu registro, vamos te enviar para a tela inicial',
      )
      navigate('/home')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12 animate-fadeIn">
      <Title align="center">Quase lá, finalize seu cadastro</Title>
      <InputContainer handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default CompleteRegister
