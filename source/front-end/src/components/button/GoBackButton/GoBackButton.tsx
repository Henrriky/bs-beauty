import { Outlet } from 'react-router'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { Button } from '../Button'
import { useSmartNavigation } from '../../../hooks/useSmartNavigation'

function GoBackButton() {
  const { isHomePage, navigationInfo, goBack } = useSmartNavigation()

  if (isHomePage || !navigationInfo) {
    return <Outlet />
  }

  return (
    <div className="">
      <Button
        type="button"
        variant="outline"
        onClick={goBack}
        label={
          <div className="flex items-center gap-3 mb-1">
            <div>
              <ArrowLongLeftIcon className="size-7 text-[#B19B86] hover:text-[#D9D9D9] transition-colors" />
            </div>
            <p className="text-lg">{navigationInfo.label}</p>
          </div>
        }
        className="border-none rounded-none hover:bg-opacity-0 hover:bg-transparent "
      />
      <hr className="block h-[1px] border-spacing-0 border-t-secondary-400 mb-10" />
      <Outlet />
    </div>
  )
}

export default GoBackButton
