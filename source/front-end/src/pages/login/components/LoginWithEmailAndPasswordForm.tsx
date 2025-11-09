import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import useAppDispatch from '../../../hooks/use-app-dispatch'
import { setToken } from '../../../store/auth/auth-slice'
import { decodeUserToken, TokenPayload } from '../../../utils/decode-token'
import * as AuthAPI from '../../../api/auth-api'
import { toast } from 'react-toastify'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'
import PasswordEyeIcon from '../../../components/password/PasswordEyeIcon'

const loginSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .min(1, 'O e-mail é obrigatório')
    .email('Por favor, forneça um e-mail válido'),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(1, 'A senha é obrigatória'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginWithEmailAndPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatchRedux = useAppDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleStandardLoginButtonClick(formData: LoginFormData) {
    try {
      const { accessToken } = await AuthAPI.loginWithEmailAndPassword(
        formData.email,
        formData.password,
      )

      const decodedToken: TokenPayload = decodeUserToken(accessToken)

      dispatchRedux(
        setToken({
          user: {
            ...decodedToken,
          },
          token: {
            accessToken,
            expiresAt: decodedToken.exp!,
          },
        }),
      )

      localStorage.setItem('token', accessToken)

      if (decodedToken.registerCompleted) {
        navigate('/customer/home')
      } else {
        navigate('/complete-register')
      }
    } catch (error: any) {
      if (error?.response?.status === 400 || error?.message?.includes('Invalid credentials')) {
        toast.error('E-mail ou senha incorretos. Verifique suas credenciais.')
      } else {
        toast.error('Erro ao tentar logar.')
      }
    }
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-3 w-full">
        <form
          onSubmit={handleSubmit(handleStandardLoginButtonClick)}
          className="flex justify-center items-center flex-col gap-3 w-[340px]"
        >
          <Input
            id="email"
            type="email"
            variant="solid"
            placeholder="E-mail"
            wrapperClassName="w-full"
            error={errors.email?.message}
            registration={register('email')}
          />
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="solid"
              placeholder="Senha"
              error={errors.password?.message}
              registration={register('password')}
            />
            <PasswordEyeIcon
              showPassword={showPassword}
              showPasswordFunction={() => setShowPassword(!showPassword)}
            />
          </div>
          <Button type="submit"
            label="Entrar"
            variant="outline"
          />
        </form>
        <div className="flex flex-col items-center">
          <p className="text-[#DBDBDB] text-sm mt-2">
            Não possui conta? {''}
            <Button
              variant="text-only"
              label="Crie uma agora!"
              className="text-sm"
              onClick={() => navigate('/register')}
            />
          </p>
          <p className="text-[#DBDBDB] text-sm mt-2">
            Esqueceu sua senha? {''}
            <Button
              variant="text-only"
              label="Redefinir senha"
              className="text-sm"
              onClick={() => navigate('/reset-password')}
            />
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginWithEmailAndPasswordForm
