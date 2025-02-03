interface ProfilePictureProps {
  profilePhotoUrl: string
  size?: 'sm' | 'md'
  variation?: 'rounded' | 'square-with-bg'
  filter?: 'black-white' | 'none'
}

function ProfilePicture({
  profilePhotoUrl,
  size = 'md',
  variation = 'rounded',
  filter = 'none',
}: ProfilePictureProps) {
  const iconSize = size === 'md' ? 'h-12 w-12' : 'h-9 w-9'

  return (
    <div
      className={`relative ${iconSize} ${
        variation === 'square-with-bg'
          ? 'before:absolute before:w-full before:h-full before:bg-[#717171] before:-right-[3px] before:-top-[2.5px] before:rounded-md before:z-5'
          : ''
      }`}
    >
      <img
        src={profilePhotoUrl}
        alt="Profile"
        className={`absolute w-full object-cover ${variation === 'rounded' ? 'rounded-full' : 'rounded-md'} ${filter === 'black-white' ? 'grayscale' : ''}`}
      />
    </div>
  )
}

export default ProfilePicture
