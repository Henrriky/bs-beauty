import ProfilePicture from '../../pages/profile/components/ProfilePicture'

interface OptionIconProps {
  profilePhotoUrl?: string
  displayName?: string
}

export function OptionIcon({ profilePhotoUrl, displayName }: OptionIconProps) {
  return <ProfilePicture profilePhotoUrl={profilePhotoUrl ?? ''} displayName={displayName ?? 'Cliente'} size="sm" />
}
