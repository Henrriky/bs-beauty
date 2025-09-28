import Title from '../../components/texts/Title'
import useAppDispatch from '../../hooks/use-app-dispatch'
import { authAPI } from '../../store/auth/auth-api'
import UserRegisterForm from './components/UserRegistrationForm'
import * as AuthAPI from '../../api/auth-api'
import { decodeUserToken } from '../../utils/decode-token'
import { setToken } from '../../store/auth/auth-slice'
import { toast } from 'react-toastify'
import { OnSubmitCustomerRegistrationFormData } from './types'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { useState } from 'react'
import CodeValidationModal from './components/CodeValidationModal'

function UserRegistration() {
  const navigate = useNavigate()
  const dispatchRedux = useAppDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const emailSchema = z.string().email()

  const isProfessionalEmail = authAPI.useFindProfessionalByEmailQuery(email, {
    skip: !emailSchema.safeParse(email).success,
  })

  const [registerProfessional, professionalState] =
    authAPI.useRegisterProfessionalMutation()

  const [registerCustomer, customerState] =
    authAPI.useRegisterCustomerMutation()

  const register = isProfessionalEmail?.data
    ? registerProfessional
    : registerCustomer

  const isLoading = professionalState.isLoading || customerState.isLoading

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
        if (isProfessionalEmail.data) {
          handleUpdateProfileToken(data.email, data.password)
          navigate('/complete-register')
          return
        }
        setIsOpen(true)
      })
      .catch((error: unknown) => {
        console.error('Error trying to complete register', error)
        toast.error('Ocorreu um erro ao completar o seu cadastro.')
      })
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12 animate-fadeIn">
      <Title align="center">Cadastre-se e Transforme Seu Estilo!</Title>
      <UserRegisterForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        setEmail={setEmail}
        setPassword={setPassword}
        isOpen={isOpen}
      />
      {isOpen && (
        <CodeValidationModal
          email={email}
          password={password}
          isOpen={isOpen}
          isResendLoading={customerState.isLoading}
          setIsOpen={() => setIsOpen(false)}
          handleUpdateProfileToken={handleUpdateProfileToken}
          registerCustomer={() =>
            registerCustomer({ email, password, confirmPassword: password })
          }
        />
      )}
    </div>
  )
}

export default UserRegistration
