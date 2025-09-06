import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAppDispatch from '../../../hooks/use-app-dispatch'
import { setToken } from '../../../store/auth/auth-slice'
import { decodeUserToken, TokenPayload } from '../../../utils/decode-token'
import * as AuthAPI from '../../../api/auth-api'
import { toast } from 'react-toastify'
import { Input } from '../../../components/inputs/Input'
import { Button } from '../../../components/button/Button'
import PasswordEyeIcon from '../../../components/password/PasswordEyeIcon'

function LoginWithEmailAndPasswordForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const dispatchRedux = useAppDispatch()
  const navigate = useNavigate()

  async function handleStandardLoginButtonClick(e: React.FormEvent) {
    e.preventDefault()

    try {
      const { accessToken } = await AuthAPI.loginWithEmailAndPassword(
        email,
        password,
      )

      const decodedToken: TokenPayload = decodeUserToken(accessToken)

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
    } catch (error) {
      console.log(error)
      toast.error('Erro ao tentar logar.')
    }
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col gap-3">
        <form
          onSubmit={handleStandardLoginButtonClick}
          className="flex justify-center items-center flex-col gap-3"
        >
          <Input
            id="email"
            type="email"
            variant="solid"
            value={email}
            placeholder="E-mail"
            inputClassName="w-[340px]"
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="solid"
              value={password}
              placeholder="Senha"
              inputClassName="w-[340px]"
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <PasswordEyeIcon
              showPassword={showPassword}
              showPasswordFunction={() => setShowPassword(!showPassword)}
            />
          </div>
          <Button label="Entrar" type="submit" variant="outline"></Button>
        </form>

        <p className="text-[#DBDBDB] text-xs">
          Não possui conta? {''}
          <Button
            variant="text-only"
            label="Crie uma agora!"
            className="text-xs"
            onClick={() => navigate('/register')}
          />
        </p>
      </div>
    </>
  )
}

export default LoginWithEmailAndPasswordForm
