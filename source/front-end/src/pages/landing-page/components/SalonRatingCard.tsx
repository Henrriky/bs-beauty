import Star from './Star'

interface SalonRatingCardProps {
  image: string
  name: string
  meanRating: number
  ratingCount: number
}

function SalonRatingCard({
  image,
  name,
  meanRating,
  ratingCount,
}: SalonRatingCardProps) {
  const safeMean = Number.isFinite(meanRating) ? meanRating : 0
  const clamped = Math.max(0, Math.min(5, safeMean))
  const fills = Array.from({ length: 5 }).map((_, i) => {
    const starIndex = i + 1
    const full = Math.max(0, Math.min(1, clamped - (starIndex - 1)))
    return Math.round(full * 100)
  })

  const uid = `${name?.replace(/\s+/g, '-') || 'salon'}-${Math.round(clamped * 100)}-${ratingCount}`

  return (
    <div className="flex items-center justify-center gap-1 lg:gap-16 min-w-[150px] w-full p-4 lg:p-8 lg:py-6 border-primary-100 rounded-lg bg-primary-800">
      <div className="flex items-center flex-col text-center">
        <img
          src={image}
          alt={'Logo do salão'}
          className="w-16 h-16 lg:w-24 lg:h-24 rounded-full"
        />
        <span className="text-primary-0 pt-1 text-sm lg:text-lg">{name}</span>
      </div>

      <div className="flex flex-col items-center justify-center ml-3 lg:ml-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {fills.map((pct, idx) => (
              <Star key={idx} fillPercent={pct} id={`${uid}-${idx}`} />
            ))}
          </div>
        </div>
        <div className="text-primary-100 text-sm lg:text-lg mt-1">
          <span className="font-extrabold text-xl lg:text-3xl">{clamped.toFixed(1)}</span> /
          5.0
        </div>
      </div>

      <div className="text-primary-100 text-sm sm:text-base lg:text-lg items-center text-center ml-auto lg:ml-0">
        {ratingCount <= 0 ? (
          'Não Avaliado'
        ) : (
          <span>
            {'Total de avaliações:'} <br /> ({ratingCount})
          </span>
        )}
      </div>
    </div>
  )
}

export default SalonRatingCard
