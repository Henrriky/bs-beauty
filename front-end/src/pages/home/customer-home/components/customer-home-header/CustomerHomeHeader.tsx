import useAppSelector from '../../../../../hooks/use-app-selector'

function CustomerHomeHeader() {
  const userName = useAppSelector((state) => state.auth.user?.name)

  return (
    <header>
      <h2 className="text-2xl mt-10 mb-2">
        <span className="text-primary-100">Bem vindo(a), </span>
        <span className="text-[#A4978A]">{userName}</span>
      </h2>
      <div className="bg-[#595149] w-1/2 h-0.5 mt-2"></div>
    </header>
  )
}

export default CustomerHomeHeader
