import {
  BellIcon,
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import { ReactNode, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import ProfilePicture from '../../pages/profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../utils/formatter/first-letter-of-word-to-upper-case.util'

interface SideBarItemProps {
  path: string
  icon: ReactNode
  children?: ReactNode
}

function SideBar() {
  const user = useAppSelector((state) => state.auth.user!)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }

  return (
    <>
      <div
        className={`${isSideBarOpen ? 'flex flex-row w-full h-full absolute left-0 top-[0px]' : ''} `}
      >
        <nav
          className={`bg-primary-900 mb-5 ${isSideBarOpen ? 'h-full w-9/12 z-20' : 'w-full z-0 left-0 top-[0px]'}`}
        >
          <div
            className={`text-[12px] transition-all ${isSideBarOpen ? 'mt-11 flex flex-col gap-5' : 'flex flex-row gap-2 justify-center pt-5'}`}
          >
            <button
              className={`transition-all w-[25px] text-primary-400 hover:w-[30px] hover:text-primary-200 ${isSideBarOpen ? 'place-self-end mr-5 absolute' : 'mr-auto'} `}
              onClick={toggleSideBar}
            >
              {isSideBarOpen ? <XMarkIcon /> : <Bars3Icon className="size-7" />}
            </button>
            <ProfilePicture profilePhotoUrl={user.profilePhotoUrl} size="sm" />
            {isSideBarOpen && (
              <h2 className="text-primary-0 mb-9 text-sm capitalize">
                {user.name ? firstLetterOfWordToUpperCase(user.name) : ''}
              </h2>
            )}
          </div>
          {isSideBarOpen && (
            <div className="">
              <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />
              <ul className="text-primary-200 mt-8 text-[12px]">
                <SideBarItem
                  icon={<HomeIcon className="size-6" />}
                  path="/home"
                >
                  Home
                </SideBarItem>
                <SideBarItem icon={<BellIcon className="size-6" />} path="#">
                  Notificações
                </SideBarItem>
                <SideBarItem icon={<UserIcon className="size-6" />} path="#">
                  Perfil
                </SideBarItem>
                <SideBarItem
                  icon={<CalendarDaysIcon className="size-6" />}
                  path="#"
                >
                  Agendamentos
                </SideBarItem>
              </ul>
            </div>
          )}
        </nav>
        <div
          id="blur"
          onClick={() => toggleSideBar()}
          className={`${isSideBarOpen ? 'w-full h-full backdrop-blur-sm' : 'hidden'}`}
        ></div>
      </div>
      <section className="w-full h-max">
        <Outlet />
      </section>
    </>
  )
}

function SideBarItem(props: SideBarItemProps) {
  const navigate = useNavigate()
  return (
    <>
      <li
        className="transition-all py-2 px-4 rounded-full flex text-sm flex-row gap-[18px] cursor-pointer h-[35px] w-[289px] items-center hover:bg-primary-300 hover:text-white"
        onClick={() => {
          navigate(`${props.path}`)
        }}
      >
        {props.icon}
        <p className="text-primary-0">{props.children}</p>
      </li>
    </>
  )
}

export default SideBar
