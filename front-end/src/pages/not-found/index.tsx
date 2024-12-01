import { useNavigate } from 'react-router'
import { Button } from '../../components/button/Button'
import Title from '../../components/texts/Title'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-10 justify-center items-center h-full">
      <Title align="center">Ops, parece que essa rota não existe</Title>
      <Button
        label="Ir para o menu principal"
        onClick={() => {
          navigate('/')
        }}
      />
    </div>
  )
}

export default NotFound