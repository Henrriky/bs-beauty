import Subtitle from '../../../../../components/texts/Subtitle'
import useAppSelector from '../../../../../hooks/use-app-selector'

function CustomerHomeHeader() {
  const userName = useAppSelector((state) => state.auth.user?.name)

  return (
    <header>
      <Subtitle align="left">
        Bem vindo(a), <b className="text-[#A4978A]">{userName}</b>
      </Subtitle>
      <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>
    </header>
  )
}

export default CustomerHomeHeader
