import { Outlet } from "react-router"


function Layout () {

  return (
    <div 
      className="bg-[#1E1E1E] text-[$D9D9D9] h-screen"
    >
      <main className="p-4">{ <Outlet/> }</main>
    </div>
  )
}


export default Layout