import { UseFormRegisterReturn } from 'react-hook-form'
import { Textarea } from '../../../components/inputs/Textarea'
import Title from '../../../components/texts/Title'
import Subtitle from '../../../components/texts/Subtitle'

interface RatingUIProps {
  score: number
  hover: number
  onStarClick?: (value: number) => void
  onStarHover?: (value: number) => void
  onStarLeave?: () => void
  commentValue?: string | null
  commentRegistration?: UseFormRegisterReturn<'comment'>
  isInteractive: boolean
  userType: 'professional' | 'customer'
}
const ratingEmojis: { [key: number]: string } = {
  0: '🤔',
  1: '😠',
  2: '🙁',
  3: '🙂',
  4: '😄',
  5: '😍',
}

export function RatingUI(props: RatingUIProps) {
  const displayScore = props.isInteractive
    ? props.hover || props.score
    : props.score

  return (
    <div className="flex-grow flex flex-col items-center justify-center gap-4 w-full">
      <Title align="center">
        {props.userType === 'customer'
          ? props.isInteractive
            ? 'O que achou do atendimento?'
            : 'Sua Avaliação'
          : 'Avaliação do Cliente'}
      </Title>
      {props.userType === 'customer' && (
        <Subtitle className="text-primary-100 text-sm" align="center">
          {props.isInteractive
            ? 'Seu feedback nos ajuda a melhorar.'
            : 'Obrigado pelo seu feedback!'}
        </Subtitle>
      )}
      <div className="text-5xl min-h-[60px] flex items-center justify-center">
        {displayScore >= 0 && (
          <span key={displayScore} className="animate-moveUp">
            {ratingEmojis[displayScore]}
          </span>
        )}
      </div>
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1
          return (
            <label key={index}>
              <input
                type="radio"
                className="hidden "
                value={ratingValue}
                onClick={() =>
                  props.isInteractive && props.onStarClick?.(ratingValue)
                }
                disabled={!props.isInteractive}
              />
              <svg
                className={`w-8 h-8 transition-colors ${props.isInteractive ? 'cursor-pointer' : ''}`}
                fill={ratingValue <= displayScore ? '#ffc107' : '#e4e5e9'}
                onMouseEnter={() =>
                  props.isInteractive && props.onStarHover?.(ratingValue)
                }
                onMouseLeave={() =>
                  props.isInteractive && props.onStarLeave?.()
                }
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </label>
          )
        })}
      </div>
      {(props.isInteractive ||
        (!props.isInteractive && props.commentValue)) && (
        <Textarea
          id="comment"
          label="Comentário"
          wrapperClassName="w-full"
          registration={
            props.isInteractive ? props.commentRegistration : undefined
          }
          value={!props.isInteractive ? (props.commentValue ?? '') : undefined}
          disabled={!props.isInteractive}
          placeholder={'Deixe um comentário (opcional)'}
        />
      )}
    </div>
  )
}
