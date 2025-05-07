import { Bars3Icon } from '@heroicons/react/16/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Outlet } from 'react-router'

function MenuLayout() {
  return (
    <>
      <nav className="py-6 w-full">
        <ul className="flex list-none justify-between text-zinc-200 gap-2">
          <li>
            <Bars3Icon className="text-zinc-200 size-7" />
          </li>
          <li>
            <UserCircleIcon className="text-zinc-200 size-7" />
          </li>
        </ul>
      </nav>
      <section className="w-full h-max">
        <Outlet />
      </section>
    </>
  )
}

export default MenuLayout
