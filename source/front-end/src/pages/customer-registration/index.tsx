import Title from '../../components/texts/Title'
import useAppDispatch from '../../hooks/use-app-dispatch'
import { authAPI } from '../../store/auth/auth-api'
import CustomerRegisterForm from './components/CustomerRegistrationForm'
import * as AuthAPI from '../../api/auth-api'
import { decodeUserToken } from '../../utils/decode-token'
import { setRegisterCompleted, setToken } from '../../store/auth/auth-slice'
import { toast } from 'react-toastify'
import { OnSubmitCustomerRegistrationFormData } from './types'
import { useNavigate } from 'react-router'

function CustomerRegistration() {
  const navigate = useNavigate()
  const dispatchRedux = useAppDispatch()
  const [register, { isLoading }] = authAPI.useRegisterCustomerMutation()

  async function handleUpdateProfileToken(email: string, password: string) {
    try {
      const { accessToken } = await AuthAPI.loginWithEmailAndPassword(
        email,
        password,
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
          },
          token: {
            accessToken,
            expiresAt: decodedToken.exp!,
          },
        }),
      )

      localStorage.setItem('token', accessToken)
      dispatchRedux(authAPI.util.invalidateTags(['User']))
    } catch (error) {
      console.error('Erro ao atualizar token:', error)
      toast.error('Erro ao atualizar token')
    }
  }

  const handleSubmit: OnSubmitCustomerRegistrationFormData = async (
    data,
    e,
  ) => {
    e?.preventDefault()
    await register(data)
      .unwrap()
      .then(() => {
        dispatchRedux(setRegisterCompleted())
        handleUpdateProfileToken(data.email, data.password)
        navigate('/register-completed')
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12 animate-fadeIn">
      <Title align="center">Cadastre-se e Transforme Seu Estilo!</Title>
      <CustomerRegisterForm handleSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

export default CustomerRegistration
