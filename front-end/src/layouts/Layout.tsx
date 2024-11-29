import { Outlet } from 'react-router'
import LAYOUT_CONFIG from './consts'

function Layout() {
  return (
    <div className="bg-[#1E1E1E] text-[$D9D9D9] h-screen">
      <main
        className='px-4 h-full'
        // className={`${'px-' + LAYOUT_CONFIG.MAIN_HORIZONTAL_PADDING.toString()} h-full`}
      >
        {<Outlet />}
      </main>
    </div>
  )
}

export default Layout
