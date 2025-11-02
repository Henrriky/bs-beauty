import { Outlet } from 'react-router'

function Layout() {
  return (
    <div className="bg-primary-900 text-[$D9D9D9] min-h-[100vh] max-w-[1100px] pb-3 w-full animate-fadeIn">
      <main
        className="px-4 h-full relative"
        // className={`${'px-' + LAYOUT_CONFIG.MAIN_HORIZONTAL_PADDING.toString()} h-full`}
      >
        {<Outlet />}
      </main>
    </div>
  )
}

export default Layout
