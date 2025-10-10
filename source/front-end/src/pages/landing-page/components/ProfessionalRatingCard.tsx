import { StarIcon } from '@heroicons/react/16/solid'
import ProfilePicture from '../../profile/components/ProfilePicture'
import userIcon from '../../../assets/user-icon.svg'
import { UserIcon } from '@heroicons/react/24/solid'
interface ProfessionalRatingCardProps {
  name: string
  specialization: string
  profilePhotoUrl: string | undefined
  rating: string
  numberOfReviews: number
}

function ProfessionalRatingCard({
  name,
  specialization,
  profilePhotoUrl,
  rating,
  numberOfReviews,
}: ProfessionalRatingCardProps) {
  return (
    <div className="flex flex-col justify-center gap-1 min-w-[150px] min-h-56 p-4 border-primary-100 rounded-lg bg-primary-800">
      <div className="flex items-center flex-col text-center">
        {profilePhotoUrl ? (
          <ProfilePicture profilePhotoUrl={profilePhotoUrl || userIcon} />
        ) : (
          <UserIcon className="w-12 h-12 text-[#977458]" />
        )}
        <span className="text-primary-0 pt-1">{name}</span>
        <span className="text-primary-100 text-sm">{specialization}</span>
      </div>
      <div className="flex justify-center align-middle gap-1 mt-1 items-center">
        <StarIcon className="text-[#977458] size-4" />
        <span className="text-primary-100">{rating}</span>
      </div>
      <span className="text-primary-100 text-xs items-center text-center">
        {numberOfReviews <= 0
          ? 'Não Avaliado'
          : numberOfReviews + ' avaliações'}
      </span>
    </div>
  )
}

export default ProfessionalRatingCard
