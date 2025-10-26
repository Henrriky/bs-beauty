import { useNavigate } from 'react-router'
import { Button } from '../../components/button/Button'
import Title from '../../components/texts/Title'
import BSBeautyLogo from '../../components/logo/BSBeautyLogo'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-full animate-fadeIn">
      <BSBeautyLogo width="100" height="100" />
      <Title align="center">Ops, parece que essa rota não existe</Title>
      <Button
        label="Ir para o menu principal"
        className='max-w-screen-sm'
        onClick={() => {
          navigate('/')
        }}
      />
    </div>
  )
}

export default NotFound
