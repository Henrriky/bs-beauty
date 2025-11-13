import { UserIcon } from '@heroicons/react/16/solid'

interface ProfilePictureProps {
  profilePhotoUrl: string
  displayName?: string
  size?: 'sm' | 'md'
  variation?: 'rounded' | 'square-with-bg'
  filter?: 'black-white' | 'none'
}

function ProfilePicture({
  profilePhotoUrl,
  displayName,
  size = 'md',
  variation = 'rounded',
  filter = 'none',
}: ProfilePictureProps) {
  const hasPhoto = Boolean(profilePhotoUrl && profilePhotoUrl.trim())
  const containerSize = size === 'md' ? 'h-12 w-12' : 'h-9 w-9'
  const shape = variation === 'rounded' ? 'rounded-full' : 'rounded-md'
  const filterClass = filter === 'black-white' ? 'grayscale' : ''

  const getInitialLetter = (name?: string) => {
    const n = (name ?? '').trim()
    if (!n) return ''
    return n.split(/\s+/).find(Boolean)?.charAt(0).toUpperCase() ?? ''
  }

  const PALETTE = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#3F51B5',
    '#03A9F4',
    '#009688',
    '#4CAF50',
    '#FF9800',
    '#795548',
    '#607D8B',
  ]

  const hashString = (s: string) =>
    Array.from(s).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0)

  const initialLetter = getInitialLetter(displayName)

  const bgColor = initialLetter
    ? PALETTE[hashString(displayName!.toLowerCase()) % PALETTE.length]
    : '#717171'

  const textSize = size === 'md' ? 'text-lg' : 'text-sm'

  return (
    <div
      className={`relative shrink-0 ${containerSize} ${
        variation === 'square-with-bg'
          ? 'before:absolute before:w-full before:h-full before:bg-[#717171] before:-right-[3px] before:-top-[2.5px] before:rounded-md'
          : ''
      }`}
      aria-label={displayName ? `Avatar de ${displayName}` : 'Avatar'}
    >
      {hasPhoto ? (
        <img
          src={profilePhotoUrl}
          alt={displayName ? `Foto de ${displayName}` : 'Foto de perfil'}
          className={`absolute inset-0 w-full h-full object-cover ${shape} ${filterClass}`}
          loading="lazy"
        />
      ) : (
        <div
          className={`absolute inset-0 ${shape} flex items-center justify-center select-none`}
          style={{ backgroundColor: bgColor, color: '#FFFFFF' }}
        >
          {initialLetter ? (
            <span className={`${textSize} font-semibold leading-none`}>
              {initialLetter}
            </span>
          ) : (
            <UserIcon className="h-2/3 w-2/3 text-white/90" />
          )}
        </div>
      )}
    </div>
  )
}

export default ProfilePicture
