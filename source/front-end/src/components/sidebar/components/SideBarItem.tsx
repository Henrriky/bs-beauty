import { useNavigate } from "react-router"
import useAppDispatch from "../../../hooks/use-app-dispatch"
import { serverLogout } from "../../../store/auth/server-logout"
import { ReactNode } from "react"

interface SideBarItemProps {
  path: string
  icon: ReactNode
  children?: ReactNode
  toggleSideBar?: () => void
  closeOnClick?: boolean
  isActive?: boolean
}

function SideBarItem(props: Readonly<SideBarItemProps>) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (props.children === 'Sair') {
      await dispatch(serverLogout())
      navigate('/', { replace: true })
    } else {
      navigate(`${props.path}`)
    }
    if (props.closeOnClick && props.toggleSideBar) props.toggleSideBar()
  }

  const activeClasses = props.isActive ? 'bg-primary-300 text-white' : ''

  return (
    <li
      className={`
        relative transition-colors px-4 py-2 rounded-full
        flex items-center gap-[18px] text-sm cursor-pointer
        h-[40px] w-full max-w-full
        hover:bg-primary-300 hover:text-white
        overflow-hidden
        ${activeClasses}
      `}
      aria-current={props.isActive ? 'page' : undefined}
    >
      <button
        onClick={handleClick}
      >
        {props.icon}
      </button>
      <p className="text-primary-0 truncate">{props.children}</p>
    </li>
  )
}

export default SideBarItem