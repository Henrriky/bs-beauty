import { Professional } from '../../../store/analytics/types'
import ProfessionalRatingCard from './ProfessionalRatingCard'
import { useEffect, useRef, useState } from 'react'

function RatingCardsContainer({
  professionals,
}: {
  professionals: Professional[]
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scrollIntervalRef = useRef<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [cardWidth, setCardWidth] = useState('40%')
  const [gapClass, setGapClass] = useState('gap-4')
  useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth
      if (width < 340) {
        setCardWidth('40%')
        setGapClass('gap-3')
      }
    }

    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || isPaused || !professionals || professionals.length <= 1) return

    const cardElement = el.querySelector('[data-card]') as HTMLElement
    const cardWidthPx = cardElement ? cardElement.offsetWidth : 300
    const gap = 16
    const step = cardWidthPx + gap
    const delayMs = 3000

    el.style.scrollBehavior = 'smooth'

    const advance = () => {
      if (!el || isPaused) return
      const maxScrollLeft = el.scrollWidth - el.clientWidth
      const next = Math.min(el.scrollLeft + step, maxScrollLeft)
      el.scrollTo({ left: next })

      if (next >= maxScrollLeft) {
        setTimeout(() => {
          if (el && !isPaused) {
            el.scrollTo({ left: 0 })
          }
        }, delayMs)
      }
    }

    scrollIntervalRef.current = window.setInterval(advance, delayMs)

    return () => {
      if (scrollIntervalRef.current) {
        window.clearInterval(scrollIntervalRef.current)
      }
    }
  }, [professionals, isPaused])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)
  const handleTouchStart = () => setIsPaused(true)
  const handleTouchEnd = () => setIsPaused(false)

  return (
    <div className="w-full mt-8 mb-16">
      <div
        ref={containerRef}
        className={`flex ${gapClass} items-stretch overflow-x-auto carousel-scrollbar px-2 no-scrollbar`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {professionals &&
          professionals.map((professional) => (
            <div
              key={professional.id}
              data-card
              style={{
                flex: `0 0 ${cardWidth}`,
                scrollSnapAlign: 'start',
              }}
            >
              <ProfessionalRatingCard
                name={professional.name || 'Profissional'}
                specialization={professional.specialization || 'Esteticista'}
                profilePhotoUrl={professional.profilePhotoUrl}
                rating={professional.meanRating?.toFixed(1) || 'N/A'}
                numberOfReviews={professional.ratingCount || 0}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default RatingCardsContainer
