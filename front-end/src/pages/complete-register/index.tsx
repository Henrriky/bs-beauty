import { useState } from 'react'
import Title from '../../components/texts/Title'
import { Button } from './components/Button'
import InputContainer from './components/InputContainer'

function CompleteRegister() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert('Cadastro finalizado com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Ocorreu um erro!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center flex-col h-full gap-12">
      <Title align="center">Quase lá, finalize seu cadastro</Title>
      <InputContainer />
      <Button
        label={
          loading ? (
            <div className="flex justify-center items-center gap-4">
              <div className="w-4 h-4 border-2 border-t-2 border-transparent border-t-white rounded-full animate-spin"></div>
              <p className="text-sm">Finalizar cadastro</p>
            </div>
          ) : (
            'Finalizar cadastro'
          )
        }
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  )
}

export default CompleteRegister
