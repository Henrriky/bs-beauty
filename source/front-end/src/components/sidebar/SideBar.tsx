import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { ReactNode, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import useAppSelector from '../../hooks/use-app-selector'
import ProfilePicture from '../../pages/profile/components/ProfilePicture'
import { firstLetterOfWordToUpperCase } from '../../utils/formatter/first-letter-of-word-to-upper-case.util'
import sideBarItems from './consts'
import { serverLogout } from '../../store/auth/server-logout'
import { authAPI } from '../../store/auth/auth-api'
import { userCanAccess } from '../../utils/authorization/authorization.utils'
import useAppDispatch from '../../hooks/use-app-dispatch'

interface SideBarItemProps {
  path: string
  icon: ReactNode
  children?: ReactNode
  toggleSideBar: () => void
}

function SideBar() {
  const user = useAppSelector((state) => state.auth.user!)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const selectUserInfo = authAPI.endpoints.fetchUserInfo.select()
  const userInfoQuery = useAppSelector(selectUserInfo)

  const displayName = userInfoQuery?.data?.user.name ?? user.name
  const photoUrl =
    userInfoQuery?.data?.user.profilePhotoUrl ?? user.profilePhotoUrl

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen)
  }

  const navigate = useNavigate()

  return (
    <>
      <div>
        <nav
          className={`transition-opacity ease-in-out bg-primary-900 mb-5 w-full z-0 left-0 top-[0px]`}
        >
          <div
            className={`text-[12px] transition-all flex flex-row gap-2 justify-center pt-5`}
          >
            <button
              className={`transition-all w-[25px] text-primary-400 hover:w-[30px] hover:text-primary-200 mr-auto`}
              onClick={toggleSideBar}
            >
              <Bars3Icon className="size-7" />
            </button>
            <div
              className={'hover:cursor-pointer'}
              onClick={() => navigate('/profile')}
            >
              <ProfilePicture profilePhotoUrl={photoUrl ?? ''} size="sm" />
            </div>
          </div>
        </nav>
      </div>
      <section className="w-full h-max">
        <Outlet />
      </section>

      {isSideBarOpen && (
        <div
          className={
            'transition-all flex flex-row w-full h-full absolute left-0 top-[0px]'
          }
        >
          <nav className={'bg-primary-900 mb-5 h-full w-9/12 z-20'}>
            <div
              className={`text-[12px] transition-all pl-4 mt-11 flex flex-col gap-5`}
            >
              <button
                className={`transition-all w-[25px] text-primary-400 hover:w-[30px] hover:text-primary-200 place-self-end mr-5 absolute `}
                onClick={toggleSideBar}
              >
                <XMarkIcon />
              </button>
              <div
                className={'hover:cursor-pointer w-9'}
                onClick={() => navigate('/profile')}
              >
                <ProfilePicture
                  profilePhotoUrl={user.profilePhotoUrl ?? ''}
                  size="sm"
                />
              </div>
              <h2 className="text-primary-0 mb-9 text-sm capitalize">
                {displayName ? firstLetterOfWordToUpperCase(displayName) : ''}
              </h2>
            </div>
            <div className="">
              <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />
              <ul className="text-primary-200 mt-8 text-[12px]">
                {sideBarItems
                  .filter((item) =>
                    userCanAccess({ user, ...item.authorization }),
                  )
                  .map((sideBarItem) => {
                    return (
                      <SideBarItem
                        toggleSideBar={toggleSideBar}
                        key={sideBarItem.name}
                        icon={sideBarItem.icon}
                        path={sideBarItem.navigateTo}
                      >
                        {sideBarItem.name}
                      </SideBarItem>
                    )
                  })
                  .reverse()}
              </ul>
            </div>
          </nav>
          <div
            onClick={() => toggleSideBar()}
            className={`${isSideBarOpen ? 'w-full h-full backdrop-blur-sm z-10' : 'hidden'}`}
          ></div>
        </div>
      )}
    </>
  )
}

function SideBarItem(props: SideBarItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (props.children === 'Sair') {
      await dispatch(serverLogout())
      navigate('/', { replace: true })
    } else {
      navigate(`${props.path}`)
    }
    props.toggleSideBar()
  }

  return (
    <>
      <li
        className="transition-all py-2 px-4 rounded-full flex text-sm flex-row gap-[18px] cursor-pointer h-[35px] w-[289px] items-center hover:bg-primary-300 hover:text-white"
        onClick={handleClick}
      >
        {props.icon}
        <p className="text-primary-0">{props.children}</p>
      </li>
    </>
  )
}

export default SideBar
