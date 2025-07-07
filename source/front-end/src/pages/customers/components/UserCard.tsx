import ProfilePicture from '../../profile/components/ProfilePicture'
import UserCardDescription from './UserCardDescription'
import UserCardTitle from './UserCardTitle'

interface UserCardProps {
  picture: string
  title: string
  description: string
}

function UserCard(props: UserCardProps) {
  return (
    <div className="flex items-center gap-4 py-4 px-6 rounded-2xl mt-5 bg-[#262626] border-[1px] border-[#D9D9D9] border-opacity-25">
      <ProfilePicture
        size="sm"
        profilePhotoUrl={
          props.picture
            ? props.picture
            : 'https://cdn-site-assets.veed.io/cdn-cgi/image/width=256,quality=75,format=auto/Fish_6e8d209905/Fish_6e8d209905.webp'
        }
      />
      <div>
        <UserCardTitle>{props.title}</UserCardTitle>
        <UserCardDescription>{props.description}</UserCardDescription>
      </div>
    </div>
  )
}

export default UserCard
