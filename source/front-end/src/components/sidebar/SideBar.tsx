import ProfilePicture from '../../pages/profile/components/ProfilePicture'
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { Outlet } from 'react-router'
import { firstLetterOfWordToUpperCase } from '../../utils/formatter/first-letter-of-word-to-upper-case.util'
import { useSideBar } from './hooks/use-side-bar'
import { SideBarItems } from './components/SideBarItems'

function SideBar() {
  const {
    items,
    currentUserPhotoUrl,
    currentPagePathInfo,
    currentUserDisplayName,
    isSideBarOpen,
    toggleSideBar,
    navigate,
  } = useSideBar()


  return (
    <>
      { /* SIDEBAR MOBILE */}
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

            <div
              className="hover:cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <ProfilePicture
                profilePhotoUrl={currentUserPhotoUrl ?? ''}
                displayName={currentUserDisplayName || undefined}
                size="sm"
              />
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

                <div
                  className="hover:cursor-pointer w-9"
                  onClick={() => navigate('/profile')}
                >
                  <ProfilePicture profilePhotoUrl={currentUserPhotoUrl ?? ''} size="sm" displayName={currentUserDisplayName || undefined} />
                </div>

                <h2 className="text-primary-0 mb-9 text-sm capitalize">
                  {currentUserDisplayName ? firstLetterOfWordToUpperCase(currentUserDisplayName) : ''}
                </h2>
              </div>

              <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />

              <ul className="text-primary-200 mt-8 text-[12px]">
                <SideBarItems
                  items={items}
                  currentPagePathName={currentPagePathInfo}
                  toggleSideBar={toggleSideBar}
                  isMobile={true}
                />
              </ul>
            </nav>

            <div
              onClick={toggleSideBar}
              className={`${isSideBarOpen ? 'w-1/4 h-full backdrop-blur-sm z-10' : 'hidden'}`}
            />
          </div>
        )}
      </div>

      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:grid lg:grid-cols-[16rem_1fr] lg:min_h-[100dvh]">
        <aside className="bg-primary-900 border-r border-white/10 sticky top-0 h-[100dvh] w-64 px-4 py-6">
          <button
            className="flex items-center gap-3 mb-6 hover:opacity-90 w-full pl-3"
            onClick={() => navigate('/profile')}
            aria-label="Abrir perfil"
          >
            <ProfilePicture profilePhotoUrl={currentUserPhotoUrl ?? ''} displayName={currentUserDisplayName || undefined} size="sm" />
            <div className="min-w-0 text-left ml-1">
              <span
                className="block truncate text-primary-0 text-sm capitalize"
                title={currentUserDisplayName || undefined}
              >
                {currentUserDisplayName}
              </span>
            </div>
          </button>

          <hr className="block h-[1px] border-spacing-0 border-t-secondary-400" />

          <ul className="text-primary-200 mt-6 text-[13px] space-y-1">
            <SideBarItems
              items={items}
              currentPagePathName={currentPagePathInfo}
              toggleSideBar={toggleSideBar}
              isMobile={false}
            />
          </ul>
        </aside>

        <main className="px-8 py-6">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default SideBar
