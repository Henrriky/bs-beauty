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
  toggleSideBar?: () => void
  closeOnClick?: boolean
}

function SideBar() {
  const user = useAppSelector((state) => state.auth.user!)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const selectUserInfo = authAPI.endpoints.fetchUserInfo.select()
  const userInfoQuery = useAppSelector(selectUserInfo)

  const displayName = userInfoQuery?.data?.user.name ?? user.name;
  const safeDisplayName = (displayName ?? '') as string;
  const displayNameCap = safeDisplayName
    ? firstLetterOfWordToUpperCase(safeDisplayName)
    : '';
  const photoUrl =
    userInfoQuery?.data?.user.profilePhotoUrl ?? user.profilePhotoUrl

  const toggleSideBar = () => setIsSideBarOpen((v) => !v)
  const navigate = useNavigate()

  const filteredItems = sideBarItems
    .filter((item) => userCanAccess({ user, ...item.authorization }))
    .reverse()

  return (
    <>
      <div className="lg:hidden">
        <nav className="transition-opacity ease-in-out bg-primary-900 mb-5 w-full z-0 left-0 top-0">
          <div className="text-[12px] transition-all flex flex-row gap-2 justify-center pt-5">
            <button
              className="transition-all w-[25px] text-primary-400 hover:w-[30px] hover:text-primary-200 mr-auto"
              onClick={toggleSideBar}
              aria-label="Abrir menu"
            >
              <Bars3Icon className="size-7" />
            </button>

            <div className="hover:cursor-pointer" onClick={() => navigate('/profile')}>
              <ProfilePicture profilePhotoUrl={photoUrl ?? ''} size="sm" />
            </div>
          </div>
        </nav>

        <section className="w-full h-max">
          <Outlet />
        </section>

        {isSideBarOpen && (
          <div className="transition-all flex flex-row w-full h-full absolute left-0 top-0">
            <nav className="bg-primary-900 mb-5 h-full w-9/12 z-20">
              <div className="text-[12px] transition-all pl-4 pr-4 mt-11 flex flex-col gap-5">
                <button
                  className="transition-all w-[25px] text-primary-400 hover:w-[30px] hover:text-primary-200 place-self-end mr-5 absolute"
                  onClick={toggleSideBar}
                  aria-label="Fechar menu"
                >
                  <XMarkIcon />
                </button>

                <div className="hover:cursor-pointer w-9" onClick={() => navigate('/profile')}>
                  <ProfilePicture profilePhotoUrl={photoUrl ?? ''} size="sm" />
                </div>

                <h2 className="text-primary-0 mb-9 text-sm capitalize">
                  {displayName ? firstLetterOfWordToUpperCase(displayName) : ''}
                </h2>
              </div>

              <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />

              <ul className="text-primary-200 mt-8 text-[12px]">
                {sideBarItems
                  .filter((item) =>
                    userCanAccess({ user, ...item.authorization }),
                  )
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((sideBarItem) => (
                    <SideBarItem
                      toggleSideBar={toggleSideBar}
                      key={sideBarItem.name}
                      icon={sideBarItem.icon}
                      path={sideBarItem.navigateTo}
                    >
                      {sideBarItem.name}
                    </SideBarItem>
                  ))}
              </ul>
            </nav>

            <div
              onClick={toggleSideBar}
              className={`${isSideBarOpen ? 'w-1/4 h-full backdrop-blur-sm z-10' : 'hidden'}`}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:grid lg:grid-cols-[16rem_1fr] lg:min-h-[100dvh]">
        <aside className="bg-primary-900 border-r border-white/10 sticky top-0 h-[100dvh] w-64 px-4 py-6">
          <button
            className="flex items-center gap-3 mb-6 hover:opacity-90 w-full"
            onClick={() => navigate('/profile')}
            aria-label="Abrir perfil"
          >
            <ProfilePicture profilePhotoUrl={photoUrl ?? ''} size="sm" />
            <div className="min-w-0 flex-1">
              <span
                className="block truncate text-primary-0 text-sm capitalize"
                title={safeDisplayName || undefined}
              >
                {displayNameCap}
              </span>
            </div>
          </button>

          <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />

          <ul className="text-primary-200 mt-6 text-[13px] space-y-1">
            {filteredItems.map((item) => (
              <SideBarItem
                key={item.name}
                icon={item.icon}
                path={item.navigateTo}
                closeOnClick={false}
              >
                {item.name}
              </SideBarItem>
            ))}
          </ul>
        </aside>

        <main className="px-8 py-6">
          <Outlet />
        </main>
      </div>
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
    if (props.closeOnClick && props.toggleSideBar) props.toggleSideBar()
  }

  return (
    <li
      className="
        relative transition-colors px-4 py-2 rounded-full
        flex items-center gap-[18px] text-sm cursor-pointer
        h-[40px] w-full max-w-full
        hover:bg-primary-300 hover:text-white
        overflow-hidden
      "
      onClick={handleClick}
    >
      {props.icon}
      <p className="text-primary-0 truncate">{props.children}</p>
    </li>
  )
}

export default SideBar
