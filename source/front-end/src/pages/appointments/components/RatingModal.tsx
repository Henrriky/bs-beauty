import { XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RatingUpdateFormData } from '../types'
import { RatingUI } from './RatingUI'
import { ratingAPI } from '../../../store/rating/rating-api'
import { Button } from '../../../components/button/Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  ratingId: string
  children?: ReactNode
  className?: string
}

function RatingModal({
  isOpen,
  onClose,
  appointmentId,
  ratingId,
  children,
  className,
}: ModalProps) {
  const [hover, setHover] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isValid },
  } = useForm<RatingUpdateFormData>({
    mode: 'onChange',
  })

  useEffect(() => {
    reset({ comment: '', score: 0 })
  }, [reset])

  const score = watch('score', 0)

  const [submitRating] = ratingAPI.useUpdateRatingMutation()

  const onSubmit = (formData: RatingUpdateFormData) => {
    const payload = {
      id: ratingId,
      data: formData,
      appointmentId,
    }

    submitRating(payload)
      .unwrap()
      .then(() => {
        console.log('Avaliação enviada com sucesso!')
        onClose()
      })
      .catch(console.error)
  }
  if (isOpen) {
    return (
      <div
        className={`fixed inset-0 flex justify-center items-center animate-fadeIn z-10 transition-colors ${isOpen ? 'visible bg-black/60' : 'invisible'}`}
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            'bg-[#1E1E1E] rounded-2xl shadow p-6 w-full h-fit max-w-[343px] max-h-[600px] flex justify-center items-center relative',
            className,
          )}
        >
          <XMarkIcon
            className="size-7 color-[#D9D9D9] hover:cursor-pointer hover:text-primary-0 hover:size-8 transition-all text-primary-100 absolute top-5 right-5"
            onClick={onClose}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <RatingUI
              isInteractive={true}
              score={score}
              hover={hover}
              onStarClick={(value) => setValue('score', value)}
              onStarHover={setHover}
              onStarLeave={() => setHover(0)}
              commentRegistration={{
                ...register('comment', {
                  setValueAs: (value) => (value === '' ? undefined : value),
                }),
              }}
              userType={'customer'}
            />
            <Button
              className="transition-all bg-[#A4978A] text-[#54493F] font-medium hover:bg-[#4e483f] hover:text-white disabled:bg-zinc-700 disabled:cursor-not-allowed"
              label={'Enviar Avaliação'}
              id={'submitRating'}
              type="submit"
              disabled={!isValid || !(score > 0)}
            />
            {children}
          </form>
        </div>
      </div>
    )
  }

  return null
}

export default RatingModal
