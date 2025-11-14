import ProfilePicture from '../../pages/profile/components/ProfilePicture'

interface OptionIconProps {
  profilePhotoUrl?: string
}

export function OptionIcon({ profilePhotoUrl }: OptionIconProps) {
  return <ProfilePicture profilePhotoUrl={profilePhotoUrl ?? ''} size="sm" />
}
