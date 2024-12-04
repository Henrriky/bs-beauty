import { Outlet } from 'react-router'

function Layout() {
  return (
    <div className="bg-primary-900 text-[$D9D9D9] h-screen max-w-[440px] w-full animate-fadeIn">
      <main
        className="px-4 h-full relative pt-[50px]"
      // className={`${'px-' + LAYOUT_CONFIG.MAIN_HORIZONTAL_PADDING.toString()} h-full`}
      >
        {<Outlet />}
      </main>
    </div>
  )
}

export default Layout
