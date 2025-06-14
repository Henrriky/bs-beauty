import { SetStateAction, useEffect, useState } from 'react'
import { Button } from '../../../components/button/Button'
import { offerAPI } from '../../../store/offer/offer-api'
import { toast } from 'react-toastify'
import { serviceAPI } from '../../../store/service/service-api'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Service } from '../../../store/service/types'
import { Offer } from '../../../store/offer/types'

interface ListOffersProps {
  employeeId: string
  selectOffer: (param: Offer) => void
  openUpdateModal: () => void
  openDeleteModal: () => void
}

function ListOffers({
  employeeId,
  openUpdateModal,
  openDeleteModal,
  selectOffer,
}: ListOffersProps) {
  const { data, isLoading, isError } = offerAPI.useGetOffersQuery(employeeId)

  const offers = data?.offers
  const [selected, setSelected] = useState(null)
  const [servicesData, setServicesData] = useState<
    { service: Service | null; serviceLoading: boolean }[]
  >([])

  const [fetchService] = serviceAPI.useLazyGetServiceByIdQuery()

  useEffect(() => {
    const fetchServices = async () => {
      if (offers) {
        const services = await Promise.all(
          offers.map(async (offer) => {
            try {
              const service = await fetchService(offer.serviceId).unwrap()
              return { service, serviceLoading: false }
            } catch (error) {
              console.error('Erro ao buscar serviço:', error)
              return { service: null, serviceLoading: false }
            }
          }),
        )
        setServicesData(services)
      }
    }

    fetchServices()
  }, [offers, fetchService])

  if (isLoading) {
    return (
      <p className="text-[#D9D9D9] animate-fadeIn w-full mb-8 text-sm">
        Carregando ofertas...
      </p>
    )
  }

  if (isError && data == null) {
    return (
      <p className="text-[#CC3636] animate-fadeIn w-full mt-2 text-sm">
        Não há ofertas disponíveis.
      </p>
    )
  }

  if (isError) {
    return (
      <p className="text-[#CC3636] animate-fadeIn w-full mt-2 text-sm">
        Erro ao carregar as ofertas.
      </p>
    )
  }

  return (
    <div
      onClick={() => setSelected(null)}
      className="animate-fadeIn w-full max-w-[540px] mb-8 mt-4"
    >
      <div className="max-h-[161px] scroll overflow-y-auto w-full">
        <div className="gap-2 p-[2px] w-full flex flex-col justify-center items-center">
          {offers?.map((offer, index) => {
            const service = servicesData.filter(
              (serviceData) => serviceData.service?.id === offer.serviceId,
            )

            return (
              <Button
                label={
                  <div className="flex flex-row items-center">
                    {service.at(0)?.service?.name}
                    <div className="ml-auto flex gap-3 justify-center items-center">
                      <TrashIcon
                        className="size-4 hover:text-primary-0 hover:size-5 transition-all stroke-[#D9D9D9]"
                        onClick={() => openDeleteModal()}
                      />
                    </div>
                  </div>
                }
                key={index}
                variant="outline"
                outlineVariantBorderStyle="dashed"
                onClick={(e) => {
                  setSelected(index as unknown as SetStateAction<null>)
                  selectOffer(offer as unknown as Offer)
                  e.stopPropagation()
                }}
                className={`bg-[#222222] w-full text-left px-4 py-[6px] ${selected !== index ? 'border-none' : ''}`}
              />
            )
          })}
        </div>
      </div>
      <div className="mt-3 w-full flex flex-col justify-center items-center">
        <Button
          label="Editar oferta"
          className="w-full max-h-[32px] py-[6px]"
          onClick={
            selected !== null
              ? () => {
                  openUpdateModal()
                  setSelected(null)
                }
              : () => toast.info('Selecione uma oferta.')
          }
        />
      </div>
    </div>
  )
}

export default ListOffers
