import { FetchRatingsCountResponse } from '../../../store/analytics/types'

export const calculateMeanRating = (
  ratingsCountData: FetchRatingsCountResponse | undefined,
): string | null => {
  if (!ratingsCountData) return null

  const totalRatings =
    ratingsCountData[1] +
    ratingsCountData[2] +
    ratingsCountData[3] +
    ratingsCountData[4] +
    ratingsCountData[5]

  if (totalRatings === 0) return '0.0'

  const weightedSum =
    ratingsCountData[1] * 1 +
    ratingsCountData[2] * 2 +
    ratingsCountData[3] * 3 +
    ratingsCountData[4] * 4 +
    ratingsCountData[5] * 5

  return (weightedSum / totalRatings).toFixed(1)
}
