import { useNavigate } from 'react-router'
import goBackArrow from '../../assets/go-back-arrow.svg'

function GoBackButton() {
  const navigate = useNavigate()

  return (
    <>
      <button
        className="absolute top-[16px] hover:bg-[#3A3027]"
        onClick={() => navigate(-1)}
      >
        <img src={goBackArrow} alt="Seta de voltar" />
      </button>
    </>
  )
}

export default GoBackButton
