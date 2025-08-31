import { toast } from 'react-toastify'

import Title from '../../components/texts/Title'
import CustomerInputContainer from './components/CustomerInputContainer'
import ProfessionalInputContainer from './components/ProfessionalInputContainer'

import useAppDispatch from '../../hooks/use-app-dispatch'
import useAppSelector from '../../hooks/use-app-selector'
import { authAPI } from '../../store/auth/auth-api'
import { setRegisterCompleted, setToken } from '../../store/auth/auth-slice'

import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import * as AuthAPI from '../../api/auth-api'
import { UserType } from '../../store/auth/types'
import { decodeUserToken } from '../../utils/decode-token'
import { OnSubmitProfessionalOrCustomerForm } from './types'

const userTypesToInputContainers = {
  [UserType.CUSTOMER]: CustomerInputContainer,
  [UserType.PROFESSIONAL]: ProfessionalInputContainer,
  [UserType.MANAGER]: ProfessionalInputContainer,
}

function CompleteRegister() {
  const navigate = useNavigate()
  const dispatchRedux = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user!)
  const tokens = useAppSelector((state) => state.auth.token)

  const [completeRegister, { isLoading }] =
    authAPI.useCompleteRegisterMutation()

  const InputContainer = userTypesToInputContainers[user.userType]

  async function handleUpdateProfileToken() {
    if (!tokens?.googleAccessToken) {
      toast.error('Token de acesso inválido')
      return
    }

    try {
      const { accessToken } = await AuthAPI.loginWithGoogleAccessToken(
        tokens.googleAccessToken
      )

      const decodedToken = decodeUserToken(accessToken)

      dispatchRedux(
        setToken({
          user: {
            id: decodedToken.id,
            userType: decodedToken.userType,
            email: decodedToken.email,
            name: decodedToken.name,
            registerCompleted: decodedToken.registerCompleted,
            profilePhotoUrl: decodedToken.profilePhotoUrl,
          },
          token: {
            googleAccessToken: tokens.googleAccessToken,
            accessToken,
            expiresAt: decodedToken.exp!,
          },
        })
      )

      localStorage.setItem('token', accessToken)
      dispatchRedux(authAPI.util.invalidateTags(['User']))
    } catch (err) {
      console.error('Erro ao atualizar token:', err)
      toast.error('Erro ao atualizar token')
    }
  }

  // REFACTOR TODO: Extract bellow function and useEffect to an customHook
  const handleSubmit: OnSubmitProfessionalOrCustomerForm = async (data) => {
    await completeRegister(data)
      .unwrap()
      .then(() => {
        dispatchRedux(
          // TODO: Improve this refreshing token by complete register route
          setRegisterCompleted()
        )
        handleUpdateProfileToken()
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
        'Você já completou seu registro, vamos te enviar para a tela inicial'
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
