import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface PasswordEyeIconProps {
  showPassword: boolean
  showPasswordFunction: () => void
}

function PasswordEyeIcon(props: PasswordEyeIconProps) {
  return props.showPassword ? (
    <EyeIcon
      className="size-5 stroke-[#D9D9D9] absolute inset-y-[10px] right-2 hover:stroke-[#A4978A] transition-all cursor-pointer"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => props.showPasswordFunction()}
    />
  ) : (
    <EyeSlashIcon
      className="size-5 stroke-[#D9D9D9] absolute inset-y-[10px] right-2 hover:stroke-[#A4978A] transition-all cursor-pointer"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => props.showPasswordFunction()}
    />
  )
}

export default PasswordEyeIcon
