import { Outlet } from 'react-router'

function Layout() {
  return (
    <div className="bg-[#1E1E1E] text-[$D9D9D9] h-screen max-w-[440px]">
      <main
        className="px-4 h-full"
        // className={`${'px-' + LAYOUT_CONFIG.MAIN_HORIZONTAL_PADDING.toString()} h-full`}
      >
        {<Outlet />}
      </main>
    </div>
  )
}

export default Layout
