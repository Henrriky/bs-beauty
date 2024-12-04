interface ProfilePictureProps {
  profilePhotoUrl: string
}

function ProfilePicture({ profilePhotoUrl }: ProfilePictureProps) {
  return (
    <div className="relative w-16 h-16 pr-4 overflow-hidden">
      <img
        src={profilePhotoUrl}
        alt="Profile"
        className="w-full object-cover rounded-full"
      />
      <button className="absolute bottom-4 right-4 rounded-full shadow-md z-50">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="6.82518"
            cy="6.82518"
            r="6.82518"
            fill="white"
            fillOpacity="0.75"
          />
          <path
            d="M6.55944 8.01403C6.55944 7.77844 6.36846 7.58745 6.13287 7.58745H4.42657C4.19098 7.58745 4 7.39647 4 7.16088C4 6.92529 4.19098 6.73431 4.42657 6.73431H6.13287C6.36846 6.73431 6.55944 6.54332 6.55944 6.30773V4.60144C6.55944 4.36585 6.75042 4.17487 6.98601 4.17487C7.2216 4.17487 7.41259 4.36585 7.41259 4.60144V6.30773C7.41259 6.54332 7.60357 6.73431 7.83916 6.73431H9.54545C9.78104 6.73431 9.97203 6.92529 9.97203 7.16088C9.97203 7.39647 9.78104 7.58745 9.54545 7.58745H7.83916C7.60357 7.58745 7.41259 7.77844 7.41259 8.01403V9.72032C7.41259 9.95591 7.2216 10.1469 6.98601 10.1469C6.75042 10.1469 6.55944 9.95591 6.55944 9.72032V8.01403Z"
            fill="#1E1E1E"
          />
        </svg>
      </button>
    </div>
  )
}

export default ProfilePicture
