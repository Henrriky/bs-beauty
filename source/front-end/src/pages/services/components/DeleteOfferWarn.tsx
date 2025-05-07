import { toast } from 'react-toastify'
import { Button } from '../../../components/button/Button'
import { offerAPI } from '../../../store/offer/offer-api'
import { Offer } from '../../../store/offer/types'

interface DeleteOfferWarnInputProps {
  offer: Offer
  onClose: () => void
}

function DeleteOfferWarn({ offer, onClose }: DeleteOfferWarnInputProps) {
  const [deleteOffer] = offerAPI.useDeleteOfferMutation()
  const handleDelete = async (offerId: string) => {
    try {
      await deleteOffer(offerId)
        .unwrap()
        .then(() => toast.success('Oferta deletada com sucesso!'))
    } catch (error) {
      console.error('Erro ao deletar a oferta:', error)
      toast.error('Ocorreu um erro ao deletar a oferta.')
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-evenly">
      <p className="text-[#D9D9D9] text-xl text-center mb-4">
        Tem certeza que deseja <br /> excluir a oferta?
      </p>
      <div className="flex gap-10">
        <Button
          label="Sim"
          onClick={() => {
            handleDelete(offer.id)
            onClose()
          }}
        />
        <Button label="Não" variant="outline" onClick={() => onClose()} />
      </div>
    </div>
  )
}

export default DeleteOfferWarn
