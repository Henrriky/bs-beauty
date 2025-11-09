import { SideBarItem as SideBarItemType } from '../consts'
import { isActivePath } from '../utils'
import SideBarItem from './SideBarItem'

interface SideBarItemsProps {
  isMobile?: boolean
  items: SideBarItemType[]
  toggleSideBar: () => void
  currentPagePathName: string
}

function SideBarItems({
  items,
  isMobile = false,
  toggleSideBar,
  currentPagePathName,
}: SideBarItemsProps) {
  return items.map((item) => (
    <SideBarItem
      key={item.name.concat(item.navigateTo).toLowerCase()}
      icon={item.icon}
      path={item.navigateTo}
      closeOnClick={isMobile}
      toggleSideBar={isMobile ? toggleSideBar : undefined}
      isActive={isActivePath(currentPagePathName, item.navigateTo)}
    >
      {item.name}
    </SideBarItem>
  ))
}

export { SideBarItems }
